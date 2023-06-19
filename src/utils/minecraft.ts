import TcpSocket from "react-native-tcp-socket";
import { Buffer } from "buffer";
import MinecraftServer from "~/types/MinecraftServer";

export function queryMinecraft(host: string, port = 25565, timeout = 5000) {
	return new Promise<MinecraftServer>((resolve, reject) => {
		let ping = -1;
		const pingStart = Date.now();

		const client = TcpSocket.createConnection(
			{
				port: port,
				host: host,
			},
			() => {
				ping = Date.now() - pingStart;
				client.write(Buffer.from([0xfe, 0x01]));
			}
		);

		client.setTimeout(timeout);

		client.on("error", (err) => {
			client.destroy();
			reject(err);
		});

		client.on("timeout", () => {
			client.destroy();
			reject(new Error("Timeout"));
		});

		client.on("data", (data) => {
			client.destroy();
			if (data != null && data != "") {
				const serverInfo = data.toString().split("\x00\x00\x00");
				const server = {
					host: host,
					port: port,
					version: serverInfo[2].replace(/\u0000/g, ""),
					motd: serverInfo[3].replace(/\u0000/g, ""),
					players: parseInt(serverInfo[4].replace(/\u0000/g, "")),
					maxPlayers: parseInt(serverInfo[5].replace(/\u0000/g, "")),
					ping: ping,
				} as MinecraftServer;
				resolve(server);
			} else {
				reject(new Error("No data received"));
			}
		});
	});
}
