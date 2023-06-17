import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { query } from "~/utils/minecraft";
import MinecraftServer from "~/types/MinecraftServer";

const Index = () => {
	const [data, setData] = useState<MinecraftServer>();

	useEffect(() => {
		query("192.168.233.50", 25565)
			.then((res) => setData(res))
			.catch(console.error);
	});

	return (
		<SafeAreaView className="bg-[#1F104A]">
			{/* Changes page title visible on the header */}
			<Stack.Screen options={{ title: "Home Page" }} />
			<View className="h-full w-full p-4">
				<Text className="mx-auto pb-2 text-4xl font-bold text-white">
					<Text className="text-pink-400">Game</Text>server Status
				</Text>

				<Button title="Add Server" color={"#f472b6"} />

				{data ? (
					<View className="border border-white">
						<Text className="text-green-600 text-center">{`${data.host}:${data.port}`}</Text>
						<Text className="text-green-600 text-center">{`${data.players}/${data.maxPlayers}`}</Text>
						<Text className="text-green-600 text-center">{data.version}</Text>
						<Text className="text-green-600 text-center">{data.motd}</Text>
					</View>
				) : (
					<Text className="text-red-600 text-center">Server is offline</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

export default Index;
