import { Buffer } from "buffer";

export function readVarInt(buffer: Buffer) {
  let value = 0;
  let length = 0;
  let currentByte;

  do {
    currentByte = buffer[length];
    value |= (currentByte & 0x7f) << (length * 7);
    length += 1;
    if (length > 5) {
      throw new Error("VarInt exceeds allowed bounds.");
    }
  } while ((currentByte & 0x80) === 0x80);

  return { value, length };
}
