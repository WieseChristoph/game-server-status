import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";

import { Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import ServerCard from "~/components/ServerCard";
import useServer from "~/hooks/useServer";
import GitHubButton from "~/components/GitHubButton";
import LoadingIcon from "~/components/LoadingIcon";
import DraggableFlatList from "react-native-draggable-flatlist";
import AddButton from "~/components/AddButton";

const Index = () => {
	const router = useRouter();
	const [dragging, setDragging] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const { servers, fetchAllServers, setPosition, refetchStatus } = useServer();

	useEffect(() => {
		fetchAllServers();
	}, []);

	return (
		<View className="bg-[#1d2029]">
			{/* Changes page title visible on the header */}
			<Stack.Screen
				options={{
					headerLeft: () => <GitHubButton size={30} />,
					headerTitle: () => (
						<Text className="text-3xl font-bold text-white">
							<Text className="text-[#a732f5]">Game</Text> Server Status
						</Text>
					),
					headerTitleAlign: "center",
					headerRight: () => (
						<AddButton
							size={30}
							onPress={() => router.push({ pathname: "/editServer", params: { isNew: true } })}
						/>
					),
				}}
			/>
			<View className="h-full w-full">
				<View className="flex-1">
					{servers !== null ? (
						<DraggableFlatList
							className="h-full"
							contentContainerStyle={{ paddingTop: 16 }}
							data={servers}
							onDragBegin={() => setDragging(true)}
							onDragEnd={({ from, to }) => {
								setDragging(false);
								setPosition(from, to);
							}}
							renderItem={ServerCard}
							keyExtractor={(item) => item.id}
							renderPlaceholder={() => (
								<View className="bg-[#a732f5] shadow-lg shadow-black rounded-md mx-4 mb-4 items-center min-h-[125px] flex-1" />
							)}
							showsVerticalScrollIndicator={false}
							refreshControl={
								<RefreshControl
									enabled={!dragging}
									onRefresh={() => {
										setRefreshing(true);
										refetchStatus()
											.then(() => setRefreshing(false))
											.catch((err) => {
												console.error(err);
												setRefreshing(false);
											});
									}}
									refreshing={refreshing}
								/>
							}
							ListEmptyComponent={
								<>
									<Text className="text-white text-center text-3xl font-bold">List empty</Text>
									<Text className="text-white text-center text-sm">
										Add a server with the plus in the top right corner
									</Text>
								</>
							}
						/>
					) : (
						<LoadingIcon size={64} textClassName="self-center mt-4" />
					)}
				</View>
			</View>
		</View>
	);
};

export default Index;
