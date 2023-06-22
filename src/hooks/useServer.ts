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

		newServers.sort((a, b) => a.position - b.position);

		setServers(newServers);
	}

	async function setServer(newServer: Server, isEdit = false) {
		newServer.address = newServer.address.toLocaleLowerCase();

		if (!isEdit && (await AsyncStorage.getItem(getConnectionString(newServer))) !== null)
			throw new Error("A Server with this address already exists");
		if (newServer.address.length === 0) throw new Error("Address cannot be empty");
		if (newServer.port < 0 || isNaN(newServer.port))
			throw new Error("Port cannot be empty or negative");

		if (!isEdit) newServer.position = servers?.length ?? 0;

		await AsyncStorage.setItem(getConnectionString(newServer), JSON.stringify(newServer));

		fetchAllServers();
	}

	async function removeServer(server: Server) {
		await AsyncStorage.removeItem(getConnectionString(server));

		fetchAllServers();
	}

	async function setPosition(oldPosition: number, newPosition: number) {
		if (!servers) return;

		const newServers = [...servers];
		for (const s of newServers) {
			let changed = false;

			if (s.position === oldPosition) {
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
					getConnectionString(s),
					JSON.stringify({
						position: s.position,
						type: s.type,
						displayName: s.displayName,
						address: s.address,
						port: s.port,
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
		refetch: fetchAllServers,
		setPosition,
		getConnectionString,
	};
};

export default useServer;
