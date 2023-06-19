import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Server } from "~/types/Server";

const ServerContext = createContext<{
	servers: Server[];
	setServers: Dispatch<SetStateAction<Server[]>>;
}>({
	servers: [],
	setServers: () => undefined,
});

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [servers, setServers] = useState<Server[]>([]);

	return (
		<ServerContext.Provider value={{ servers, setServers }}>{children}</ServerContext.Provider>
	);
};

export default ServerContext;
