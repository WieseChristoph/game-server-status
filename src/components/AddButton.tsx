import React from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import Svg, { Line } from "react-native-svg";

const AddButton: React.FC<{
  onPress: () => void;
  size?: number;
  color?: string;
  strokeWidth?: number;
  textClassName?: string;
}> = ({ onPress, size = 24, color = "white", strokeWidth = 2, textClassName = "" }) => {
  return (
    <Pressable className={textClassName} onPress={onPress}>
      <View style={{ width: size, height: size }}>
        <Svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Line x1="12" x2="12" y1="5" y2="19" strokeWidth={strokeWidth} />
          <Line x1="5" x2="19" y1="12" y2="12" strokeWidth={strokeWidth} />
        </Svg>
      </View>
    </Pressable>
  );
};

export default AddButton;
