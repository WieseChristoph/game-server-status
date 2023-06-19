import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

import { FlatList, Text, View } from "react-native";
import Button from "~/components/Button";
import RefreshButton from "~/components/RefreshButton";
import ServerCard from "~/components/ServerCard";
import useServer from "~/hooks/useServer";

const Index = () => {
	const router = useRouter();
	const { servers, refetch } = useServer();

	useEffect(() => {
		refetch();
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
					headerRight: () => <RefreshButton size={30} onPress={() => refetch()} />,
				}}
			/>
			<View className="h-full w-full">
				<View className="m-4">
					<Button
						text="Add Server"
						textClassName=""
						onPress={() => router.push({ pathname: "/editServer", params: { isNew: true } })}
					/>
				</View>

				<FlatList data={servers} renderItem={({ item }) => <ServerCard server={item} />} />
			</View>
		</View>
	);
};

export default Index;
