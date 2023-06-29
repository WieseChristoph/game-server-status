import "fast-text-encoding"; // Required for CUID2
import { createId } from "@paralleldrive/cuid2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Server, ServerType } from "~/types/Server";
import { queryMinecraft } from "~/utils/minecraft";
import { querySteam } from "~/utils/steam";
import useServerContext from "./useServerContext";

const useServer = () => {
	const { servers, setServers } = useServerContext();
	const [fetchAllServersRan, setFetchAllServersRan] = useState(false);

	useEffect(() => {
		// Query all servers if fetchAllServers ran
		if (fetchAllServersRan && servers) {
			queryAllServers();
			setFetchAllServersRan(false);
		}
	}, [servers, fetchAllServersRan]);

	async function fetchAllServers() {
		const keys = await AsyncStorage.getAllKeys();
		const storedServers = await AsyncStorage.multiGet(keys);

		const newServers: Server[] = [];
		for (const server of storedServers) {
			if (server[1] === null) continue;

			const newServer = JSON.parse(server[1]) as Server;
			newServers.push(newServer);
		}

		newServers.sort((a, b) => a.position - b.position);

		setServers(newServers);

		// This is a hacky way to get the servers status to update.
		// It signals to the useEffect above to query the status of the servers if this function ran and setServers ran.
		setFetchAllServersRan(true);
	}

	async function queryAllServers() {
		if (!servers) return;

		return Promise.allSettled(servers.map((s) => queryServerStatus(s)));
	}

	async function queryServerStatus(server: Server) {
		try {
			const data = await (server.type === ServerType.Minecraft
				? queryMinecraft(server.address, server.port)
				: querySteam(server.address, server.port));
			setServers((servers) => servers?.map((s) => (s.id === server.id ? { ...s, data } : s)) ?? []);
		} catch (err) {
			const error = err as Error;
			setServers(
				(servers) =>
					servers?.map((s) =>
						s.id === server.id ? { ...s, error: error.message ? error.message : String(error) } : s
					) ?? []
			);
		}
	}

	async function setServer(
		server: Omit<Server, "id" | "position"> & Partial<Pick<Server, "id" | "position">>
	) {
		if (server.address.length === 0) throw new Error("Address cannot be empty");
		if (server.port < 0 || isNaN(server.port)) throw new Error("Port cannot be empty or negative");

		server.address = server.address.toLocaleLowerCase();

		if (!server.id) {
			server.id = createId();
			server.position = servers?.length ?? 0;

			setServers((servers) => (servers ? [...servers, server as Server] : [server as Server]));
		} else {
			setServers(
				(servers) => servers?.map((s) => (s.id === server.id ? (server as Server) : s)) ?? []
			);
		}

		await AsyncStorage.setItem(server.id, JSON.stringify(server));

		queryServerStatus(server as Server);
	}

	async function removeServer(server: Server) {
		if (!servers) return;

		setServers(
			servers
				.filter((s) => s.id !== server.id)
				.map((s) => {
					if (s.position > server.position) s.position--;
					AsyncStorage.setItem(
						s.id,
						JSON.stringify({
							...s,
							data: undefined,
							error: undefined,
							position: s.position,
						})
					);
					return s;
				})
		);

		await AsyncStorage.removeItem(server.id);
	}

	async function setPosition(oldPosition: number, newPosition: number) {
		if (!servers) return;

		if (oldPosition === newPosition) return;

		const server = servers.find((s) => s.position === oldPosition);
		if (!server) return;

		const newServers = [...servers];
		for (const s of newServers) {
			let changed = false;

			if (s.id === server.id) {
				// If the server is the one we're moving, set it to the new position
				s.position = newPosition;
				changed = true;
			} else {
				// If the server is between the old and new position, move it in the opposite direction
				if (oldPosition < newPosition) {
					if (s.position > oldPosition && s.position <= newPosition) {
						s.position--;
						changed = true;
					}
				} else {
					if (s.position < oldPosition && s.position >= newPosition) {
						s.position++;
						changed = true;
					}
				}
			}

			if (changed) {
				AsyncStorage.setItem(
					s.id,
					JSON.stringify({
						...s,
						data: undefined,
						error: undefined,
						position: s.position,
					})
				);
			}
		}

		newServers.sort((a, b) => a.position - b.position);

		setServers(newServers);
	}

	return {
		servers,
		setServer,
		removeServer,
		fetchAllServers,
		refetchStatus: queryAllServers,
		setPosition,
	};
};

export default useServer;
