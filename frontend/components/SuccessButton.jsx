import React from "react";
import { Pressable, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessButton({
  title,
  onPress,
  textColor = "#FFFFFF",
  icon,
  disabled = false,
}) {
  const scale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        width: "100%",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={{
          backgroundColor: "#4CAF50",
          borderRadius: 30,
          paddingVertical: 14,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          elevation: 3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={textColor}
            style={{ marginRight: 8 }}
          />
        )}
        <Text
          style={{
            color: textColor,
            fontSize: 18,
          }}
          className="font-inter-bold"
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
