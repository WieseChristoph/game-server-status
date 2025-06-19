import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import { Server } from "~/types/Server";

interface ServerContextValue {
  servers: Server[] | null;
  setServers: Dispatch<SetStateAction<Server[] | null>>;
}

const ServerContext = createContext<ServerContextValue | undefined>(undefined);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<Server[] | null>(null);

  return <ServerContext.Provider value={{ servers, setServers }}>{children}</ServerContext.Provider>;
};

export default ServerContext;
