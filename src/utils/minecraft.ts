import TcpSocket from "react-native-tcp-socket";
import { Buffer } from "buffer";
import MinecraftServer from "~/types/MinecraftServer";
import { readVarInt } from "./helper";

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

				const hostHexArray = Buffer.from(host, "utf8")
					.toString("hex")
					.match(/.{1,2}/g)
					?.map((hex) => `0x${hex.padStart(2, "0")}`);

				const portHexArray = port
					.toString(16)
					.match(/.{1,2}/g)
					?.map((hex) => `0x${hex.padStart(2, "0")}`);

				const buffer = Buffer.from(
					[
						// https://wiki.vg/Protocol#Handshaking
						`0x${(6 + host.length).toString(16)}`, // length of packet id + data
						0x00, // packet id
						0x04, // protocol version
						`0x${host.length.toString(16).padStart(2, "0")}`, // host length
						hostHexArray, // host
						portHexArray, // port
						0x01, // next state: status
						// https://wiki.vg/Protocol#Status
						0x01,
						0x00,
					].flat()
				);

				client.write(buffer);
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

		let bytesToRead = -1;
		let dataLengthIntSize = -1;
		let fullData = "";

		client.on("data", (data) => {
			if (bytesToRead === -1) {
				const { value, length } = readVarInt(data as Buffer);
				bytesToRead = value;
				dataLengthIntSize = length;
			}

			fullData += data.toString();

			if (client.bytesRead >= bytesToRead) {
				client.destroy();
			}
		});

		client.on("close", () => {
			const serverInfo = JSON.parse(fullData.slice(fullData.indexOf("{"))) as MinecraftServer;
			serverInfo.ping = ping;
			resolve(serverInfo);
		});
	});
}
