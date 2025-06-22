// https://wiki.vg/Server_List_Ping#Status_Response
export type MinecraftServerData = {
  version: { name: string; protocol: number };
  players: { max: number; online: number; sample?: { name: string; id: string }[] };
  description: string | MinecraftServerDescription;
  favicon?: string;
  enforcesSecureChat: boolean;
  previewsChat: boolean;
  ping?: number;
};

export type MinecraftServerDescription = {
  text: string;
  extra?: {
    text: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated: boolean;
  }[];
};

export default MinecraftServerData;
