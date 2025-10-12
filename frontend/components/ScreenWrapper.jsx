import React from "react";
import { View, Platform, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

export default function ScreenWrapper({ children, backgroundColor = "#F2F2F2" }) {
  // Define el color de la barra de estado aquí para consistencia
  const statusBarColor = "#073A59"; // Tu azul oscuro de la paleta

  return (
    <SafeAreaProvider>
      {/* Ajuste para Android: Asegura que el fondo de la barra de estado sea el color de tu marca.
        Para iOS, SafeAreaView ya maneja el área.
      */}
      {Platform.OS === "android" && (
        <RNStatusBar
          backgroundColor={statusBarColor} // Establece el color de fondo de la barra de estado de Android
          barStyle="light-content" // Asegura que los íconos (hora, batería) sean blancos
        />
      )}
      {/* Ajuste para iOS: la StatusBar de RN no cambia el color de fondo, pero barStyle sí los íconos.
        Para iOS, el color de fondo de la zona de la barra de estado lo dará el SafeAreaView.
      */}
      {Platform.OS === "ios" && (
        <RNStatusBar barStyle="light-content" /> // Asegura que los íconos (hora, batería) sean blancos
      )}

      {/* Aseguramos que el SafeAreaView ocupe toda la pantalla y su fondo superior
        coincida con el de la barra de estado.
      */}
      <SafeAreaView style={{ flex: 1, backgroundColor: statusBarColor }}>
        {/*
          Aquí es donde el contenido real del ScreenWrapper se renderizará.
          El 'children' heredará el 'flex: 1' del SafeAreaView para ocupar el espacio restante,
          y su propio 'backgroundColor' si se pasa.
          Si el 'children' tiene un fondo propio (ej: el ScrollView con #F2F2F2),
          entonces el color superior de 'statusBarColor' solo se verá en el 'paddingTop' del SafeAreaView.
        */}
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>
          {children}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}