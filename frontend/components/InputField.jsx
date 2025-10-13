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
      maxLength,
      // 🔑 Propiedad clave para la flexibilidad (editable por defecto)
      editable = true,
      // 🔑 Captura el resto de las props para pasarlas al TextInput (ej: autoCapitalize)
      ...restProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedBorder = useState(new Animated.Value(0))[0];

    // Manejadores de foco y desenfoque
    const handleFocus = () => {
      // Solo anima si es editable
      if (!editable) return;
      setIsFocused(true);
      Animated.timing(animatedBorder, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      // Solo anima si es editable
      if (!editable) return;
      setIsFocused(false);
      Animated.timing(animatedBorder, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    // Interpolación de color para el borde enfocado
    const focusedBorderColor = animatedBorder.interpolate({
      inputRange: [0, 1],
      outputRange: ["#d1d5db", "#3F83BF"], // gris a azul
    });

    // 🔑 Lógica del Borde y Color del Icono para modo editable/no editable
    // El borde es gris estático si NO es editable, sino usa el color animado.
    const finalBorderColor = editable ? focusedBorderColor : "#e5e7eb"; // gray-200 aprox
    // El icono se colorea en azul solo si está enfocado Y es editable.
    const iconColor = isFocused && editable ? "#3F83BF" : "#9CA3AF";

    return (
      <View className="w-full mb-4">
        {label && (
          <Text className="text-gray-600 text-lg font-inter-semibold mb-1 ml-2">
            {label}
          </Text>
        )}

        {/* Contenedor Animado */}
        <Animated.View
          style={{
            borderWidth: 2,
            // 🔑 Usa el color fijo o animado
            borderColor: finalBorderColor,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 2,
            // 🔑 Cambia el fondo a gris si NO es editable (UX de solo lectura)
            backgroundColor: editable ? "transparent" : "#f3f4f6", // light gray
          }}
        >
          {/* Icono */}
          {icon && (
            <Ionicons
              name={icon}
              size={22}
              color={iconColor}
              style={{ marginRight: 8 }}
            />
          )}

          {/* Componente TextInput */}
          <TextInput
            ref={ref}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            inputMode={inputMode}
            value={value}
            // El onChangeText solo es efectivo si editable es true (aunque el SO lo restringe, es buena práctica)
            onChangeText={onChangeText}
            // 🔑 Solo permite el foco si es editable
            onFocus={editable ? handleFocus : undefined}
            onBlur={editable ? handleBlur : undefined}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            maxLength={maxLength}
            editable={editable} // 🔑 Pasa la prop editable al TextInput
            {...restProps} // Pasa cualquier otra prop extra
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 10,
              // 🔑 Color de texto: gris si no es editable, oscuro si lo es
              color: editable ? "#111827" : "#6b7280", // dark gray
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
