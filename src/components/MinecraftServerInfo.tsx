import { View, Text } from "react-native";
import MinecraftServer from "~/types/MinecraftServer";
import { formatMinecraftMotd } from "~/utils/minecraft";

const MinecraftServerInfo: React.FC<{
	displayName?: string;
	address: string;
	port: number;
	data?: MinecraftServer;
	error?: string;
}> = ({ displayName, address, port, data, error }) => {
	return (
		<>
			<View className="flex flex-row">
				<Text className="text-white text-xl font-bold flex-1 break-words">
					{displayName ?? "Unnamed"}
				</Text>
				<Text className="text-white text-xl font-bold">{`${data?.players ?? 0}/${
					data?.maxPlayers ?? 0
				}`}</Text>
			</View>
			{data ? (
				<>
					<View className="flex flex-row">
						<Text className="text-neutral-400 text-xs flex-1">{`${address}:${port}`}</Text>
						<Text className="text-white">{data?.version}</Text>
					</View>
					<Text className="text-neutral-400 text-xs flex-1">{data && data?.ping + "ms"}</Text>
					<Text className="text-white text-center p-2">{data.motd}</Text>
				</>
			) : (
				<View className="flex justify-center flex-1">
					<Text className="text-red-500 text-center font-bold">{error}</Text>
				</View>
			)}
		</>
	);
};

export default MinecraftServerInfo;
