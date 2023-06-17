type MinecraftServer = {
	host: string;
	port: number;
	version: string;
	motd: string;
	players: number;
	maxPlayers: number;
	ping: number;
};

export default MinecraftServer;
