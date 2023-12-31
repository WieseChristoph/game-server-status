import React from "react";

import { View, Text } from "react-native";
import MinecraftServer from "~/types/MinecraftServer";
import MinecraftMotd from "./MinecraftMotd";

const MinecraftServerInfo: React.FC<{
	displayName?: string;
	address: string;
	port: number;
	data?: MinecraftServer;
	error?: string;
}> = ({ displayName, address, port, data, error }) => {
	return (
		<>
			<View className="flex flex-row flex-1">
				<Text className="text-white text-xl font-bold flex-1 break-words">
					{displayName ?? "Unnamed"}
				</Text>
				<Text className="text-white text-xl font-bold">{`${data?.players.online ?? 0}/${
					data?.players.max ?? 0
				}`}</Text>
			</View>
			{data ? (
				<>
					<View className="flex flex-row flex-1">
						<View className="flex-1">
							<Text className="text-neutral-400 text-xs flex-1">{`${address}:${port}`}</Text>
							<Text className="text-neutral-400 text-xs flex-1">{data.ping + "ms"}</Text>
						</View>
						<Text className="text-white text-right">{data.version.name.replace(" ", "\n")}</Text>
					</View>
					<View className="border-b border-white my-1" />
					<Text className="text-white text-center p-2">
						<MinecraftMotd motd={data.description} />
					</Text>
				</>
			) : (
				<>
					<Text className="text-neutral-400 text-xs">{`${address}:${port}`}</Text>
					<View className="border-b border-white my-1" />
					<View className="flex justify-center flex-1">
						{error ? (
							<Text className="text-red-500 text-center font-bold">{error}</Text>
						) : (
							<Text className="text-white text-center font-bold">Loading...</Text>
						)}
					</View>
				</>
			)}
		</>
	);
};

export default MinecraftServerInfo;
