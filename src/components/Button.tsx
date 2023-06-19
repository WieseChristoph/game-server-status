import { View, Text, TouchableHighlight } from "react-native";

const Button: React.FC<{ text: string; textClassName?: string; onPress?: () => void }> = ({
	text,
	textClassName = "",
	onPress,
}) => {
	return (
		<TouchableHighlight onPress={onPress}>
			<View className={`p-2 bg-[#a732f5] rounded-md shadow-lg ${textClassName}`}>
				<Text className="text-white text-center font-bold text-xl">{text}</Text>
			</View>
		</TouchableHighlight>
	);
};

export default Button;
