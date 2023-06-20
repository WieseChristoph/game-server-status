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

	async function addServer(newServer: Server) {
		await AsyncStorage.setItem(getConnectionString(newServer), JSON.stringify(newServer));

		try {
			newServer.data = await queryServerData(newServer);
		} catch (err) {
			if (err instanceof Error) newServer.error = err.message;
			else newServer.error = String(err);
		}

		setServers([...servers, newServer]);
	}

	async function editServer(editedServer: Server) {
		await AsyncStorage.setItem(getConnectionString(editedServer), JSON.stringify(editedServer));

		try {
			editedServer.data = await queryServerData(editedServer);
		} catch (err) {
			if (err instanceof Error) editedServer.error = err.message;
			else editedServer.error = String(err);
		}

		setServers(
			servers.map((item) =>
				getConnectionString(item) === getConnectionString(editedServer) ? editedServer : item
			)
		);
	}

	async function removeServer(server: Server) {
		await AsyncStorage.removeItem(getConnectionString(server));
		setServers(servers.filter((item) => getConnectionString(item) !== getConnectionString(server)));
	}

	return {
		servers,
		addServer,
		editServer,
		removeServer,
		refetch: fetchAllServers,
		getConnectionString,
	};
};

export default useServer;
