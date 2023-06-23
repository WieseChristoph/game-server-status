import { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ServerType } from "~/types/Server";
import useServer from "~/hooks/useServer";
import Toast from "react-native-root-toast";

import { View, Text, TextInput } from "react-native";
import Button from "~/components/Button";
import ServerTypeSelector from "~/components/ServerTypeSelector";

const EditServer: React.FC = () => {
	const router = useRouter();
	const { isNew, server } = useLocalSearchParams();
	const { servers, setServer } = useServer();

	const serverToEdit = servers?.find((s) => s.id === server);

	const [serverType, setServerType] = useState<ServerType>(
		serverToEdit ? serverToEdit.type : ServerType.Minecraft
	);
	const [displayName, setDisplayName] = useState<string>(
		serverToEdit ? serverToEdit.displayName : ""
	);
	const [address, setAddress] = useState<string>(serverToEdit ? serverToEdit.address : "");
	const [port, setPort] = useState<number>(serverToEdit ? serverToEdit.port : 25565);

	return (
		<View className="bg-[#1d2029]">
			{/* Changes page title visible on the header */}
			<Stack.Screen
				options={{
					headerTitle: () => (
						<Text className="text-4xl font-bold text-white">
							<Text className="text-[#a732f5]">
								{isNew !== undefined && isNew === "true" ? "Add" : "Edit"}
							</Text>{" "}
							Server
						</Text>
					),
					headerTintColor: "white",
				}}
			/>
			<View className="h-full w-full p-4">
				<ServerTypeSelector
					selected={serverType}
					onSelect={(selection) => {
						setServerType(selection);
						setPort(selection === ServerType.Minecraft ? 25565 : 27015);
					}}
				/>
				<TextInput
					className="bg-[#2f333f] mt-3 rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5]"
					placeholder="Display name"
					placeholderTextColor="gray"
					onChangeText={(text) => setDisplayName(text)}
					defaultValue={displayName}
					maxLength={32}
				/>
				<View className="flex flex-row mt-3">
					<TextInput
						className="bg-[#2f333f] rounded-md p-2 flex-1 mr-3 text-white border border-neutral-500 focus:border-[#a732f5]"
						placeholder="Address"
						placeholderTextColor="gray"
						onChangeText={(text) => setAddress(text)}
						defaultValue={address}
						autoCorrect={false}
					/>
					<TextInput
						className="bg-[#2f333f] rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5] w-1/5"
						placeholder="Port"
						placeholderTextColor="gray"
						inputMode="numeric"
						maxLength={5}
						onChangeText={(text) => setPort(parseInt(text))}
						defaultValue={port >= 0 ? port.toString() : ""}
					/>
				</View>

				<View className="mt-4">
					<Button
						text="Save"
						onPress={() =>
							setServer(
								serverType,
								displayName,
								address,
								port,
								serverToEdit?.id,
								serverToEdit?.position
							)
								.then(() => router.push("/"))
								.catch((err: Error) =>
									Toast.show(err.message, { duration: 5000, backgroundColor: "red" })
								)
						}
					/>
				</View>
			</View>
		</View>
	);
};

export default EditServer;
