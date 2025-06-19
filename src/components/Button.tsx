import React from "react";

import { View, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";

const Button: React.FC<{
  text: string;
  textClassName?: string;
  onPress?: () => void;
}> = ({ text, textClassName = "", onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className={`p-2 bg-[#a732f5] rounded-md shadow-lg ${textClassName}`}>
        <Text className="text-white text-center font-bold text-xl">{text}</Text>
      </View>
    </Pressable>
  );
};

export default Button;
