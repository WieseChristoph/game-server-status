import dgram from "react-native-udp";
import { Buffer } from "buffer";

function randomPort() {
	return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

export function querySteam(host: string, port = 27015, timeout = 5000) {
	return new Promise((resolve, reject) => {
		const client = dgram.createSocket({ type: "udp4", debug: true });

		client.bind(randomPort(), (err: Error | undefined) => {
			if (err) {
				client.close();
				reject(err);
			}
		});

		client.on("message", (data, rinfo) => {
			console.log("MSG: ", data, " RInfo: ", rinfo);
			client.close();
		});

		client.once("listening", () => {
			console.log("listening");
			// https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
			client.send(
				Buffer.concat([
					Buffer.from([0xff, 0xff, 0xff, 0xff]),
					Buffer.from([0x54]),
					Buffer.from("Source Engine Query", "ascii"),
					Buffer.from([0x00]),
				]),
				0,
				Buffer.length,
				port,
				host,
				(err) => {
					console.log("send");
					if (err) {
						client.close();
						reject(err);
					}
				}
			);
		});
	});
}
