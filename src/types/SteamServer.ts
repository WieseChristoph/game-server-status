// https://developer.valvesoftware.com/wiki/Server_queries#Response_Format
export type SteamServer = {
	ping: number;
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

export default SteamServer;
