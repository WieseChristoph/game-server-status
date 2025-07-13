import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, useState } from 'react';
import { Server, ServerBase } from '~/types/Server';
import { queryMinecraftServer } from '~/utils/minecraft';
import { querySteamServer } from '~/utils/steam';

type ServerMap = Record<number, Server>;

interface ServerContextValue {
  servers: ServerMap;
  addServer: (server: Omit<ServerBase, 'id' | 'position'>) => Promise<ServerBase>;
  updateServer: (server: ServerBase) => void;
  deleteServer: (serverId: number) => void;
  changePosition: (serverId: number, newPos: number) => void;
  queryServer: (server: ServerBase | Server) => void;
  queryAllServers: () => void;
}

const ServerContext = createContext<ServerContextValue | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useSQLiteContext();
  const [servers, setServers] = useState<ServerMap>({});
  const [initialServerQuery, setInitialServerQuery] = useState<boolean>(false);

  React.useEffect(() => {
    loadFromDb();
  }, []);

  React.useEffect(() => {
    if (initialServerQuery) {
      queryAllServers();
      setInitialServerQuery(false);
    }
  }, [initialServerQuery, servers]);

  const loadFromDb = React.useCallback(async () => {
    try {
      const dbRows = await db.getAllAsync<ServerBase>('SELECT * FROM server ORDER BY position ASC');

      const serversMap: ServerMap = {};
      dbRows.forEach((row) => {
        serversMap[row.id] = {
          ...row,
          data: undefined,
          error: undefined,
        };
      });

      setServers(serversMap);
      setInitialServerQuery(true);
    } catch (error) {
      console.error('Failed to reload servers from database:', error);
    }
  }, [db]);

  const queryServer = React.useCallback(
    async (server: ServerBase | Server) => {
      setServers((prev) => ({ ...prev, [server.id]: { ...prev[server.id], error: undefined } }));

      try {
        const data =
          server.type === 'minecraft'
            ? await queryMinecraftServer(server.address, server.port)
            : await querySteamServer(server.address, server.port);

        setServers((prev) => ({ ...prev, [server.id]: { ...prev[server.id], data } as Server }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setServers((prev) => ({
          ...prev,
          [server.id]: { ...prev[server.id], error: errorMessage, data: undefined } as Server,
        }));
      }
    },
    [servers],
  );

  const queryAllServers = React.useCallback(
    async (onlyWithoutData: boolean = false) => {
      const serversToQuery = Object.values(servers).filter((server) => !onlyWithoutData || server.data === undefined);

      await Promise.allSettled(serversToQuery.map((server) => queryServer(server)));
    },
    [queryServer],
  );

  const addServer = React.useCallback(async (server: Omit<ServerBase, 'id' | 'position'>) => {
    if (!server.address) throw new Error('Address cannot be empty');
    if (server.port < 0 || Number.isNaN(server.port)) throw new Error('Port cannot be empty or negative');

    let addedServer: ServerBase = {} as ServerBase;

    await db.withTransactionAsync(async () => {
      const { nextPos } = (await db.getFirstAsync<{ nextPos: number }>(
        'SELECT COALESCE(MAX(position) + 1, 0) AS nextPos FROM server',
      )) ?? { nextPos: 0 };

      const { lastInsertRowId } = await db.runAsync(
        `INSERT INTO server (type, displayName, address, port, position) VALUES (?,?,?,?,?)`,
        server.type,
        server.displayName,
        server.address,
        server.port,
        nextPos,
      );

      addedServer = {
        id: lastInsertRowId,
        position: nextPos,
        ...server,
      };

      setServers((prev) => ({
        ...prev,
        [lastInsertRowId]: addedServer,
      }));
    });

    return addedServer;
  }, []);

  const updateServer = React.useCallback(
    async (server: ServerBase) => {
      if (!server.address) throw new Error('Address cannot be empty');
      if (server.port < 0 || Number.isNaN(server.port)) throw new Error('Port cannot be empty or negative');

      await db.runAsync(
        `UPDATE server SET type=?, displayName=?, address=?, port=?, position=? WHERE id = ?`,
        server.type,
        server.displayName,
        server.address,
        server.port,
        server.position,
        server.id,
      );

      setServers((prev) => {
        const current = prev[server.id];
        if (!current) return prev; // no such row

        const changedConn =
          (server.type !== undefined && server.type !== current.type) ||
          (server.address !== undefined && server.address !== current.address) ||
          (server.port !== undefined && server.port !== current.port);

        return {
          ...prev,
          [server.id]: {
            ...server,
            data: changedConn ? undefined : current.data,
            error: changedConn ? undefined : current.error,
          },
        } as Server;
      });
    },
    [db],
  );

  const deleteServer = React.useCallback(
    async (serverId: number) => {
      await db.runAsync('DELETE FROM server WHERE id = ?', serverId);

      setServers((prev) => {
        const { [serverId]: _removed, ...rest } = prev;
        return rest;
      });
    },
    [db],
  );

  const changePosition = React.useCallback(
    async (serverId: number, newPos: number) => {
      await db.withTransactionAsync(async () => {
        const { oldPos } = (await db.getFirstAsync<{ oldPos: number }>(
          'SELECT position AS oldPos FROM server WHERE id = ?',
          serverId,
        )) ?? { oldPos: null };

        if (oldPos === null) throw new Error('Server not found');

        const { cnt } = (await db.getFirstAsync<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM server')) ?? { cnt: 0 };

        newPos = Math.max(0, Math.min(newPos, cnt));
        if (newPos === oldPos) return; // nothing to do

        /* ── 2. shift the block that lies between oldPos & newPos ── */
        if (oldPos < newPos) {
          // moved *down* the list → pull everything above up by -1
          await db.runAsync(
            `UPDATE server
               SET position = position - 1
             WHERE position > ? AND position <= ?`,
            oldPos,
            newPos,
          );
        } else {
          // moved *up* → push everything below down by +1
          await db.runAsync(
            `UPDATE server
               SET position = position + 1
             WHERE position >= ? AND position < ?`,
            newPos,
            oldPos,
          );
        }

        /* ── 3. drop the row into its new slot ───────────────────── */
        await db.runAsync('UPDATE server SET position = ? WHERE id = ?', newPos, serverId);
      });

      /* ── 4. reflect it in React state (O(n) pass) ──────────────── */
      setServers((prev) => {
        const oldPos = prev[serverId].position;
        const next: ServerMap = {};

        Object.values(prev).forEach((s) => {
          if (s.id === serverId) {
            next[s.id] = { ...s, position: newPos };
          } else if (oldPos < newPos && s.position > oldPos && s.position <= newPos) {
            next[s.id] = { ...s, position: s.position - 1 }; // shifted up
          } else if (oldPos > newPos && s.position >= newPos && s.position < oldPos) {
            next[s.id] = { ...s, position: s.position + 1 }; // shifted down
          } else {
            next[s.id] = s; // unchanged
          }
        });

        return next;
      });
    },
    [db],
  );

  const value = React.useMemo(
    () => ({
      servers,
      addServer,
      updateServer,
      deleteServer,
      changePosition,
      queryServer,
      queryAllServers,
    }),
    [servers, addServer, updateServer, deleteServer, changePosition, queryServer, queryAllServers],
  );

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};

export default ServerContext;
