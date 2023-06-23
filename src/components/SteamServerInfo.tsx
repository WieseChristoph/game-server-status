import React from "react";
import SteamServer from "~/types/SteamServer";

import { View, Text } from "react-native";

const SteamServerInfo: React.FC<{
	displayName?: string;
	address: string;
	port: number;
	data?: SteamServer;
	error?: string;
}> = ({ displayName, address, port, data, error }) => {
	return (
		<>
			<View className="flex flex-row">
				<Text className="text-white text-xl font-bold flex-1">{displayName ?? "Unnamed"}</Text>
				<Text className="text-white text-xl font-bold">{`${data?.info.players ?? 0}/${
					data?.info.maxPlayers ?? 0
				}`}</Text>
			</View>
			{data ? (
				<>
					<View className="flex flex-row">
						<Text className="text-neutral-400 text-xs flex-1">{`${address}:${port}`}</Text>
						<Text className="text-white">{data?.info.game}</Text>
					</View>
					<Text className="text-neutral-400 text-xs">{data && data?.ping + "ms"}</Text>

					<Text className="text-white text-center p-2">{data.info.name}</Text>
				</>
			) : (
				<View className="flex justify-center flex-1">
					<Text className="text-red-500 text-center text-2xl font-bold">{error}</Text>
				</View>
			)}
		</>
	);
};

export default SteamServerInfo;
