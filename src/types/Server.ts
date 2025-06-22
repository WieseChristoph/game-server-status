import MinecraftServerData from './MinecraftServer';
import SteamServerData from './SteamServer';

export type ServerType = 'minecraft' | 'steam';

export type ServerBase = {
  id: number;
  position: number;
  type: ServerType;
  displayName: string;
  address: string;
  port: number;
};

type ServerVariant<T extends ServerType, D> = ServerBase & {
  type: T;
  data?: D;
  error?: string;
};

export type MinecraftServer = ServerVariant<'minecraft', MinecraftServerData>;
export type SteamServer = ServerVariant<'steam', SteamServerData>;

export type Server = MinecraftServer | SteamServer;
