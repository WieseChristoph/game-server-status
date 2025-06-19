import MinecraftServer from "./MinecraftServer";
import SteamServer from "./SteamServer";

export enum ServerType {
  Minecraft,
  Steam,
}

export type Server = {
  id: string;
  position: number;
  type: ServerType;
  displayName: string;
  address: string;
  port: number;
  data?: MinecraftServer | SteamServer;
  error?: string;
};
