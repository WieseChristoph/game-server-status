type SteamServer = {
	ping: number;
	info: SteamServerInfo;
	players: SteamServerPlayer;
};

export type SteamServerInfo = {
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
	visibility: number;
	vac: number;
	version: string;
	port?: number;
	serverId?: bigint;
	spectatorPort?: number;
	spectatorName?: string;
	keywords?: string;
	gameId?: bigint;
};

export type SteamServerPlayer = {
	playerCount: number;
	players: SteamPlayer[];
};

export type SteamPlayer = {
	index: number;
	name: string;
	score: number;
	duration: number;
};

export default SteamServer;
