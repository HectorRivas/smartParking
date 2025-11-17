import React from "react";
import { View, Text } from "react-native";

// Componente: CardInfo
// Tarjeta simple para agrupar información con estilo consistente.
export default function CardInfo({
  title,
  children,
  style,
}) {
  return (
    <View
      style={[
        {
          width: "90%",
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280", // gris suave
          textAlign: "center",
          marginBottom: 12,
        }}
        className="font-inter-semibold"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
