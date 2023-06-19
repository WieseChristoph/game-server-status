import { useRef } from "react";

import { Animated, Easing, TouchableHighlight } from "react-native";
import Svg, { Path } from "react-native-svg";

const RefreshButton: React.FC<{
	onPress: () => void;
	size?: number;
	color?: string;
	strokeWidth?: number;
	textClassName?: string;
}> = ({ onPress, size = 24, color = "white", strokeWidth = 2, textClassName }) => {
	const spinValue = useRef(new Animated.Value(0)).current;

	const rotation = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const spinAnim = Animated.timing(spinValue, {
		toValue: 1,
		duration: 1000,
		easing: Easing.linear,
		useNativeDriver: true,
	});

	return (
		<TouchableHighlight
			onPress={() => {
				spinAnim.reset();
				onPress();
				spinAnim.start();
			}}
		>
			<Animated.View
				style={{ width: size, height: size, transform: [{ rotate: rotation }] }}
				className={textClassName}
			>
				<Svg
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke={color}
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<Path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeWidth={strokeWidth} />
					<Path d="M21 3v5h-5" strokeWidth={strokeWidth} />
					<Path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" strokeWidth={strokeWidth} />
					<Path d="M8 16H3v5" strokeWidth={strokeWidth} />
				</Svg>
			</Animated.View>
		</TouchableHighlight>
	);
};

export default RefreshButton;
