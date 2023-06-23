import "fast-text-encoding"; // Required for CUID2
import { createId } from "@paralleldrive/cuid2";
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
			queryServerData(newServer);

			newServers.push(newServer);
		}

		newServers.sort((a, b) => a.position - b.position);

		setServers(newServers);
	}

	async function queryServerData(server: Server) {
		if (server.type === ServerType.Minecraft) {
			queryMinecraft(server.address, server.port)
				.then((data) => setServerData(server, data))
				.catch((err) =>
					setServerData(server, undefined, err instanceof Error ? err.message : String(err))
				);
		} else {
			querySteam(server.address, server.port)
				.then((data) => setServerData(server, data))
				.catch((err) =>
					setServerData(server, undefined, err instanceof Error ? err.message : String(err))
				);
		}
	}

	function setServerData(server: Server, data?: MinecraftServer | SteamServer, error?: string) {
		if (data)
			setServers((servers) => servers?.map((s) => (s.id === server.id ? { ...s, data } : s)) ?? []);
		else if (error)
			setServers(
				(servers) => servers?.map((s) => (s.id === server.id ? { ...s, error } : s)) ?? []
			);
	}

	async function setServer(
		type: ServerType,
		displayName: string,
		address: string,
		port: number,
		id?: string,
		position?: number
	) {
		address = address.toLocaleLowerCase();

		if (address.length === 0) throw new Error("Address cannot be empty");
		if (port < 0 || isNaN(port)) throw new Error("Port cannot be empty or negative");

		if (!id) {
			id = createId();
			position = servers?.length ?? 0;
		}

		await AsyncStorage.setItem(
			id,
			JSON.stringify({
				id,
				position,
				type,
				displayName,
				address,
				port,
			})
		);

		fetchAllServers();
	}

	async function removeServer(server: Server) {
		await AsyncStorage.removeItem(server.id);

		fetchAllServers();
	}

	async function setPosition(oldPosition: number, newPosition: number) {
		if (!servers) return;

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
		refetch: fetchAllServers,
		setPosition,
	};
};

export default useServer;
