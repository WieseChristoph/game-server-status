// https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
export type A2S_INFO = {
  protocol: number;
  name: string;
  map: string;
  folder: string;
  game: string;
  appId: number;
  players: number;
  maxPlayers: number;
  bots: number;
  serverType: string;
  environment: string;
  private: boolean;
  vac: boolean;
  version: string;
};

// https://developer.valvesoftware.com/wiki/Server_queries#A2S_PLAYER
export type A2S_PLAYER = {
  players: number;
  playerList: {
    name: string;
    score: number;
    duration: number;
  }[];
};

export type SteamServer = {
  ping: number;
  a2sInfo: A2S_INFO;
  a2sPlayer?: A2S_PLAYER;
};

export default SteamServer;
