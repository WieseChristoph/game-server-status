import dgram from "react-native-udp";
import { Buffer } from "buffer";
import SteamServer from "~/types/SteamServer";

function randomPort() {
	return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

function readString(buffer: Buffer) {
	return buffer.slice(0, buffer.indexOf(0x00)).toString("utf8");
}

function readSteamServer(buffer: Buffer) {
	const server = {} as SteamServer;

	// Remove header
	buffer = buffer.slice(4 + 1);

	// Read protocol version
	server.protocol = buffer.readUInt8(0);
	buffer = buffer.slice(1);
	// Read name
	server.name = readString(buffer);
	buffer = buffer.slice(buffer.indexOf(0x00) + 1);
	// Read map
	server.map = readString(buffer);
	buffer = buffer.slice(buffer.indexOf(0x00) + 1);
	// Read folder
	server.folder = readString(buffer);
	buffer = buffer.slice(buffer.indexOf(0x00) + 1);
	// Read game
	server.game = readString(buffer);
	buffer = buffer.slice(buffer.indexOf(0x00) + 1);
	// Read appid
	server.appId = buffer.readUInt16LE(0);
	buffer = buffer.slice(2);
	// Read players
	server.players = buffer.readUInt8(0);
	buffer = buffer.slice(1);
	// Read max players
	server.maxPlayers = buffer.readUInt8(0);
	buffer = buffer.slice(1);
	// Read bots
	server.bots = buffer.readUInt8(0);
	buffer = buffer.slice(1);
	// Read server type
	server.serverType = buffer.slice(0, 1).toString("utf8");
	buffer = buffer.slice(1);
	// Read environment
	server.environment = buffer.slice(0, 1).toString("utf8");
	buffer = buffer.slice(1);
	// Read visibility
	server.private = Boolean(buffer.readUInt8(0));
	buffer = buffer.slice(1);
	// Read vac
	server.vac = Boolean(buffer.readUInt8(0));
	buffer = buffer.slice(1);
	// Read version
	server.version = readString(buffer);
	buffer = buffer.slice(buffer.indexOf(0x00) + 1);

	return server;
}

export function querySteam(host: string, port = 27015, timeout = 5000) {
	return new Promise<SteamServer>((resolve, reject) => {
		let ping = -1;
		let pingStart = -1;

		const socket = dgram.createSocket({ type: "udp4" });

		const timeoutFn = setTimeout(() => {
			socket.close(() => reject(new Error("Timeout")));
		}, timeout);

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
				// Resend status request with challenge number
				// https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
				const statusRequestBuffer = Buffer.concat([
					Buffer.from([0xff, 0xff, 0xff, 0xff]),
					Buffer.from([0x54]),
					Buffer.from("Source Engine Query", "ascii"),
					Buffer.from([0x00]),
					data.slice(5), // Append challenge number from response
				]);

				socket.send(statusRequestBuffer, 0, statusRequestBuffer.length, port, host, (err) => {
					if (err) {
						socket.close();
						reject(err);
					}
				});
			} else {
				const server = readSteamServer(data);
				server.ping = ping;

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

		socket.on("error", (err) => {
			socket.close();
			reject(err);
		});

		socket.on("close", () => {
			clearTimeout(timeoutFn);
		});
	});
}
