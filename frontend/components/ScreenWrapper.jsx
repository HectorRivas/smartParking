import React from "react";
import { View, Platform, StatusBar as RNStatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

// Componente: ScreenWrapper
// Provee SafeArea + StatusBar consistente para las pantallas de la app.
export default function ScreenWrapper({ children, backgroundColor = "#F2F2F2" }) {
  const statusBarColor = "#073A59";

  return (
    <SafeAreaProvider>
      {Platform.OS === "android" && <RNStatusBar backgroundColor={statusBarColor} barStyle="light-content" />}
      {Platform.OS === "ios" && <RNStatusBar barStyle="light-content" />}

      <SafeAreaView style={{ flex: 1, backgroundColor: statusBarColor }}>
        <View style={{ flex: 1, backgroundColor: backgroundColor }}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}