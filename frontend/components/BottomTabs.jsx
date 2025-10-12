import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomTabs({ state, navigation }) {
  if (!state?.routes) return null; // protege contra undefined

  const currentIndex = state.index; // índice de la pestaña activa
  const routes = state.routes; // rutas actuales

  const iconMap = {
    reservar: "car-outline",
    pagar: "card-outline",
    qr: "qr-code-outline",
    historial: "time-outline",
    configuracion: "settings-outline",
  };

  return (
    <View className="flex-row bg-white h-20 items-center justify-around border-t border-gray-200 shadow-md relative">
      {routes.map((route, index) => {
        const routeName = route.name;
        const isFocused = currentIndex === index;
        const iconName = iconMap[routeName] || "ellipse-outline";

        // Botón QR central
        if (routeName === "qr") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(routeName)}
              className="absolute -top-6 bg-gray-100 w-16 h-16 rounded-full items-center justify-center shadow-lg"
            >
              <Ionicons
                name={iconName}
                size={32}
                color={isFocused ? "#3F83BF" : "#273940"}
              />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(routeName)}
            className="flex-1 items-center"
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? "#3F83BF" : "#273940"}
            />
            <Text
              className={`text-xs mt-1 ${
                isFocused ? "text-[#3F83BF] font-semibold" : "text-[#273940]"
              }`}
            >
              {routeName.charAt(0).toUpperCase() + routeName.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
