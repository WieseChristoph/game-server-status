import React, { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { queryMinecraft } from "~/utils/minecraft";
import MinecraftServer from "~/types/MinecraftServer";
import RefreshButton from "~/components/RefreshButton";
import { querySteam } from "~/utils/steam";

const Index = () => {
	const router = useRouter();

	const [data, setData] = useState<MinecraftServer[]>([]);

	useEffect(() => {
		queryMinecraft("192.168.233.50", 25565)
			.then((res) => setData([...data, res]))
			.catch(console.error);

		querySteam("127.0.0.1", 27015)
			.then((res) => console.log(res))
			.catch(console.error);
	}, []);

	return (
		<View className="bg-[#1d2029]">
			{/* Changes page title visible on the header */}
			<Stack.Screen
				options={{
					headerTitle: () => (
						<Text className="text-4xl font-bold text-white">
							<Text className="text-[#a732f5]">Game</Text>server Status
						</Text>
					),
					headerRight: () => (
						<RefreshButton
							size={30}
							onPress={() => {
								queryMinecraft("192.168.233.50", 25565)
									.then((res) => setData([...data, res]))
									.catch(console.error);
								querySteam("127.0.0.1", 27015)
									.then((res) => console.log(res))
									.catch(console.error);
							}}
						/>
					),
				}}
			/>
			<View className="h-full w-full p-4">
				<View className="mb-4">
					<Button
						title="Add Server"
						color={"#a732f5"}
						onPress={() => router.push({ pathname: "/editServer", params: { isNew: true } })}
					/>
				</View>

				<FlatList
					data={data}
					renderItem={({ item }) => (
						<View className="border border-white">
							<Text className="text-green-600 text-center">{`${item.host}:${item.port}`}</Text>
							<Text className="text-green-600 text-center">{`${item.players}/${item.maxPlayers}`}</Text>
							<Text className="text-green-600 text-center">{item.version}</Text>
							<Text className="text-green-600 text-center">{item.motd}</Text>
							<Text className="text-green-600 text-center">{item.ping}ms</Text>
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default Index;
