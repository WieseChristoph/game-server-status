import dgram from "react-native-udp";
import { Buffer } from "buffer";
import SteamServer from "~/types/SteamServer";

function randomPort() {
	return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

function readString(buffer: Buffer) {
	return buffer.slice(0, buffer.indexOf(0x00)).toString("utf8");
}

export function querySteam(host: string, port = 27015, timeout = 5000) {
	return new Promise<SteamServer>((resolve, reject) => {
		let ping = -1;
		let pingStart = -1;

		setTimeout(() => reject(new Error("Timeout")), timeout);

		const socket = dgram.createSocket({ type: "udp4" });

		socket.bind(randomPort(), (err: Error | undefined) => {
			if (err) {
				socket.close();
				reject(err);
			}
		});

		socket.on("message", function (data: Buffer) {
			ping = Date.now() - pingStart;

			const header = data.at(4);

			if (header === 65) {
				// https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
				const statusRequestBuffer = Buffer.concat([
					Buffer.from([0xff, 0xff, 0xff, 0xff]),
					Buffer.from([0x54]),
					Buffer.from("Source Engine Query", "ascii"),
					Buffer.from([0x00]),
					data.slice(5), // append challenge number from response
				]);

				socket.send(statusRequestBuffer, 0, statusRequestBuffer.length, port, host, (err) => {
					if (err) {
						socket.close();
						reject(err);
					}
				});
			} else {
				// remove header
				data = data.slice(4 + 1);

				const server = {} as SteamServer;
				server.ping = ping;

				// read protocol version
				server.protocol = data.readUInt8(0);
				data = data.slice(1);
				// read name
				server.name = readString(data);
				data = data.slice(data.indexOf(0x00) + 1);
				// read map
				server.map = readString(data);
				data = data.slice(data.indexOf(0x00) + 1);
				// read folder
				server.folder = readString(data);
				data = data.slice(data.indexOf(0x00) + 1);
				// read game
				server.game = readString(data);
				data = data.slice(data.indexOf(0x00) + 1);
				// read appid
				server.appId = data.readUInt16LE(0);
				data = data.slice(2);
				// read players
				server.players = data.readUInt8(0);
				data = data.slice(1);
				// read max players
				server.maxPlayers = data.readUInt8(0);
				data = data.slice(1);
				// read bots
				server.bots = data.readUInt8(0);
				data = data.slice(1);
				// read server type
				server.serverType = data.slice(0, 1).toString("utf8");
				data = data.slice(1);
				// read environment
				server.environment = data.slice(0, 1).toString("utf8");
				data = data.slice(1);
				// read visibility
				server.private = Boolean(data.readUInt8(0));
				data = data.slice(1);
				// read vac
				server.vac = Boolean(data.readUInt8(0));
				data = data.slice(1);
				// read version
				server.version = readString(data);
				data = data.slice(data.indexOf(0x00) + 1);

				socket.close();

				resolve(server);
			}
		});

		socket.once("listening", () => {
			// https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
			const statusRequestBuffer = Buffer.concat([
				Buffer.from([0xff, 0xff, 0xff, 0xff]),
				Buffer.from([0x54]),
				Buffer.from("Source Engine Query", "ascii"),
				Buffer.from([0x00]),
			]);

			socket.send(statusRequestBuffer, 0, statusRequestBuffer.length, port, host, (err) => {
				if (err) {
					socket.close();
					reject(err);
				}
			});

			pingStart = Date.now();
		});
	});
}
