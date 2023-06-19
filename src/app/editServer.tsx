import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Button } from "react-native";

const EditServer: React.FC = () => {
	const { isNew } = useLocalSearchParams();

	return (
		<View className="bg-[#1d2029]">
			<Stack.Screen
				options={{
					headerTitle: () => (
						<Text className="text-4xl font-bold text-white">
							<Text className="text-[#a732f5]">
								{isNew !== undefined && isNew === "true" ? "Add" : "Edit"}
							</Text>
							Server
						</Text>
					),
					headerTintColor: "white",
				}}
			/>
			<View className="h-full w-full p-4">
				<TextInput
					className="bg-[#2f333f] rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5]"
					placeholder="Display name"
					placeholderTextColor="gray"
				/>
				<View className="flex flex-row mt-3">
					<TextInput
						className="bg-[#2f333f] rounded-md p-2 grow mr-3 text-white border border-neutral-500 focus:border-[#a732f5]"
						placeholder="Adress"
						placeholderTextColor="gray"
					/>
					<TextInput
						className="bg-[#2f333f] rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5] w-1/5"
						placeholder="Port"
						placeholderTextColor="gray"
						keyboardType="numeric"
						maxLength={5}
					/>
				</View>

				<View className="mt-4">
					<Button title="Save" color={"#a732f5"} />
				</View>
			</View>
		</View>
	);
};

export default EditServer;
