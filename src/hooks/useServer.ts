import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import ServerContext from "~/context/ServerContext";
import MinecraftServer from "~/types/MinecraftServer";
import { Server, ServerType } from "~/types/Server";
import SteamServer from "~/types/SteamServer";
import { queryMinecraft } from "~/utils/minecraft";
import { querySteam } from "~/utils/steam";

const useServer = () => {
	const { servers, setServers } = useContext(ServerContext);

	function getConnectionString(server: Server) {
		return `${server.address}:${server.port}`;
	}

	function queryServerData(server: Server) {
		return new Promise<MinecraftServer | SteamServer>((resolve, reject) => {
			if (server.type === ServerType.Minecraft) {
				queryMinecraft(server.address, server.port)
					.then((data) => resolve(data))
					.catch((err) => reject(err));
			} else {
				querySteam(server.address, server.port)
					.then((data) => resolve(data))
					.catch((err) => reject(err));
			}
		});
	}

	async function fetchAllServers() {
		const keys = await AsyncStorage.getAllKeys();
		const storedServers = await AsyncStorage.multiGet(keys);

		const newServers: Server[] = [];
		for (const server of storedServers) {
			if (server[1] === null) continue;

			const newServer = JSON.parse(server[1]) as Server;
			try {
				newServer.data = await queryServerData(newServer);
			} catch (err) {
				if (err instanceof Error) newServer.error = err.message;
				else newServer.error = String(err);
			}

			newServers.push(newServer);
		}

		setServers(newServers);
	}

	async function setServer(newServer: Server, isEdit = false) {
		newServer.address = newServer.address.toLocaleLowerCase();

		if (!isEdit && (await AsyncStorage.getItem(getConnectionString(newServer))) !== null)
			throw new Error("A Server with this address already exists");
		if (newServer.address.length === 0) throw new Error("Address cannot be empty");
		if (newServer.port < 0 || isNaN(newServer.port))
			throw new Error("Port cannot be empty or negative");

		await AsyncStorage.setItem(getConnectionString(newServer), JSON.stringify(newServer));

		fetchAllServers();
	}

	async function removeServer(server: Server) {
		await AsyncStorage.removeItem(getConnectionString(server));

		fetchAllServers();
	}

	return {
		servers,
		setServer,
		removeServer,
		refetch: fetchAllServers,
		getConnectionString,
	};
};

export default useServer;
