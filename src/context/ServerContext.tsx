import React, { Dispatch, SetStateAction, createContext, useState } from "react";
import { Server } from "~/types/Server";

const ServerContext = createContext<{
	servers: Server[] | null;
	setServers: Dispatch<SetStateAction<Server[] | null>>;
}>({
	servers: [],
	setServers: () => undefined,
});

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [servers, setServers] = useState<Server[] | null>(null);

	return (
		<ServerContext.Provider value={{ servers, setServers }}>{children}</ServerContext.Provider>
	);
};

export default ServerContext;
