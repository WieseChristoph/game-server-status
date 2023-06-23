import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

import { Text, View } from "react-native";
import Button from "~/components/Button";
import RefreshButton from "~/components/RefreshButton";
import ServerCard from "~/components/ServerCard";
import useServer from "~/hooks/useServer";
import GitHubButton from "~/components/GitHubButton";
import LoadingIcon from "~/components/LoadingIcon";
import DraggableFlatList from "react-native-draggable-flatlist";

const Index = () => {
	const router = useRouter();
	const { servers, refetch, setPosition } = useServer();

	useEffect(() => {
		refetch();
	}, []);

	return (
		<View className="bg-[#1d2029]">
			{/* Changes page title visible on the header */}
			<Stack.Screen
				options={{
					headerLeft: () => <GitHubButton size={30} />,
					headerTitle: () => (
						<Text className="text-3xl font-bold text-white">
							<Text className="text-[#a732f5]">Game</Text>server Status
						</Text>
					),
					headerTitleAlign: "center",
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

				{servers !== null ? (
					<DraggableFlatList
						data={servers}
						onDragEnd={({ data, from, to }) => setPosition(from, to)}
						renderItem={ServerCard}
						keyExtractor={(item) => item.id}
						renderPlaceholder={() => (
							<View className="bg-[#2f333f] shadow-lg shadow-black rounded-md mx-4 mb-4 items-center h-[125px]" />
						)}
					/>
				) : (
					<LoadingIcon size={64} textClassName="self-center mt-4" />
				)}
			</View>
		</View>
	);
};

export default Index;
