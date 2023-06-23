import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

import Svg, { Path } from "react-native-svg";

const LoadingIcon: React.FC<{ size?: number; color?: string; textClassName?: string }> = ({
	size = 24,
	color = "white",
	textClassName = "",
}) => {
	const spinValue = useRef(new Animated.Value(0)).current;

	const rotation = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	useEffect(() => {
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1000,
				easing: Easing.linear,
				useNativeDriver: true,
			})
		).start();
	}, []);

	return (
		<Animated.View
			style={{ width: size, height: size, transform: [{ rotate: rotation }] }}
			className={textClassName}
		>
			<Svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				stroke={color}
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<Path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</Svg>
		</Animated.View>
	);
};

export default LoadingIcon;
