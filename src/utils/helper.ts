import { Buffer } from "buffer";

export function readVarInt(buffer: Buffer) {
	let value = 0;
	let length = 0;
	let currentByte;

	while (true) {
		currentByte = buffer[length];
		value |= (currentByte & 0x7f) << (length * 7);
		length += 1;
		if (length > 5) {
			throw new Error("VarInt exceeds allowed bounds.");
		}
		if ((currentByte & 0x80) != 0x80) break;
	}

	return { value, length };
}
