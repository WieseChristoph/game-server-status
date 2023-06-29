import { useContext } from "react";
import ServerContext from "~/context/ServerContext";

const useServerContext = () => {
	const serverContext = useContext(ServerContext);
	if (serverContext === undefined) {
		throw new Error("useServerContext must be inside a ServerProvider");
	}
	return serverContext;
};

export default useServerContext;
