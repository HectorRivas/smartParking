import React from "react";
import { Pressable, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SecondaryButton({
  title,
  onPress,
  borderColor = "#3F83BF",
  textColor = "#3F83BF",
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
          marginVertical: 10,
          backgroundColor: "white",
          borderRadius: 30,
          borderWidth: 2,
          borderColor: borderColor,
          paddingVertical: 12,
          paddingHorizontal: 20,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          elevation: 2,
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
            fontSize: 16,
          }}
          className="font-inter-semibold"
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
