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

			const serverData = JSON.parse(server[1]) as Server;
			try {
				if (serverData.type === ServerType.Minecraft) {
					serverData.data = await queryMinecraft(serverData.address, serverData.port);
				} else {
					serverData.data = await querySteam(serverData.address, serverData.port);
				}
			} catch (err) {
				console.error(err);
			}

			newServers.push(serverData);
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

	async function addServer(server: Server) {
		await AsyncStorage.setItem(getConnectionString(server), JSON.stringify(server));

		const serverData = await queryServerData(server).catch(console.error);
		if (!serverData) return;
		server.data = serverData;

		setServers([...servers, server]);
	}

	async function editServer(server: Server) {
		await AsyncStorage.setItem(getConnectionString(server), JSON.stringify(server));

		const serverData = await queryServerData(server).catch(console.error);
		if (!serverData) return;
		server.data = serverData;

		setServers(
			servers.map((item) =>
				getConnectionString(item) === getConnectionString(server) ? server : item
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
