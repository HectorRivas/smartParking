import React, { useState, forwardRef } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InputField = forwardRef(
  (
    {
      label,
      placeholder,
      secureTextEntry,
      keyboardType,
      inputMode,
      value,
      onChangeText,
      icon,
      returnKeyType,
      onSubmitEditing,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedBorder = useState(new Animated.Value(0))[0];

    const handleFocus = () => {
      setIsFocused(true);
      Animated.timing(animatedBorder, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      setIsFocused(false);
      Animated.timing(animatedBorder, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const borderColor = animatedBorder.interpolate({
      inputRange: [0, 1],
      outputRange: ["#d1d5db", "#3F83BF"],
    });

    return (
      <View className="w-full mb-4">
        {label && (
          <Text className="text-gray-600 text-lg font-inter-semibold mb-1 ml-2">
            {label}
          </Text>
        )}
        <Animated.View
          style={{
            borderWidth: 2,
            borderColor,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 2,
          }}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={isFocused ? "#3F83BF" : "#9CA3AF"}
              style={{ marginRight: 8 }}
            />
          )}
          <TextInput
            ref={ref} // <-- aquí se pasa el ref correctamente
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            inputMode={inputMode}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 10,
              color: "#111827",
            }}
            className="font-inter"
            placeholderTextColor="#9CA3AF"
          />
        </Animated.View>
      </View>
    );
  }
);

export default InputField;
