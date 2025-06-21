import MinecraftServer from './MinecraftServer';
import SteamServer from './SteamServer';

type ServerDataMap = {
  minecraft: MinecraftServer;
  steam: SteamServer;
};

export type ServerType = keyof ServerDataMap;

export type ServerBase<T extends ServerType> = {
  id: string;
  position: number;
  type: T;
  displayName: string;
  address: string;
  port: number;
  data?: ServerDataMap[T];
  error?: string;
};

export type Server = {
  [K in ServerType]: ServerBase<K>;
}[ServerType];
