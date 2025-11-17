import React, { useState, forwardRef } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Componente: InputField
// Campo de texto reusable con icono, estilo animado para foco y modo solo-lectura.
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
      maxLength,
      editable = true,
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedBorder = useState(new Animated.Value(0))[0];

    // Manejo de foco: anima el borde cuando el campo es editable
    const handleFocus = () => {
      if (!editable) return;
      setIsFocused(true);
      Animated.timing(animatedBorder, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      if (!editable) return;
      setIsFocused(false);
      Animated.timing(animatedBorder, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const focusedBorderColor = animatedBorder.interpolate({
      inputRange: [0, 1],
      outputRange: ["#d1d5db", "#3F83BF"],
    });

    const finalBorderColor = editable ? focusedBorderColor : "#e5e7eb";
    const iconColor = isFocused && editable ? "#3F83BF" : "#9CA3AF";

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
            borderColor: finalBorderColor,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 2,
            backgroundColor: editable ? "transparent" : "#f3f4f6",
          }}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={iconColor}
              style={{ marginRight: 8 }}
            />
          )}

          <TextInput
            ref={ref}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            inputMode={inputMode}
            value={value}
            onChangeText={onChangeText}
            onFocus={editable ? handleFocus : undefined}
            onBlur={editable ? handleBlur : undefined}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            maxLength={maxLength}
            editable={editable}
            {...restProps}
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 10,
              color: editable ? "#111827" : "#6b7280",
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
