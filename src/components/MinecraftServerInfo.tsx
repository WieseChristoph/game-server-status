import { View, Text } from "react-native";
import MinecraftServer from "~/types/MinecraftServer";

const MinecraftServerInfo: React.FC<{
	displayName?: string;
	address: string;
	port: number;
	data?: MinecraftServer;
}> = ({ displayName, address, port, data }) => {
	return (
		<>
			<View className="flex flex-row">
				<Text className="text-white text-xl font-bold grow">{displayName ?? "Unnamed"}</Text>
				<Text className="text-white text-xl font-bold">{`${data?.players ?? 0}/${
					data?.maxPlayers ?? 0
				}`}</Text>
			</View>
			{data ? (
				<>
					<View className="flex flex-row">
						<Text className="text-neutral-400 text-xs grow">{`${address}:${port}`}</Text>
						<Text className="text-white">{data?.version}</Text>
					</View>
					<Text className="text-neutral-400 text-xs grow">{data && data?.ping + "ms"}</Text>

					<Text className="text-white text-center p-2">{data.motd}</Text>
				</>
			) : (
				<View className="flex justify-center grow">
					<Text className="text-red-500 text-center text-2xl font-bold">Offline</Text>
				</View>
			)}
		</>
	);
};

export default MinecraftServerInfo;
