import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Alert, Animated, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import ScreenWrapper from "../components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP_ADDRESS = process.env.EXPO_PUBLIC_API_URL;

export default function ScanQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const lineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // Animación de la línea del scanner
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(lineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>No tienes permiso para usar la cámara</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);

    // Vibración suave al escanear
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const res = await fetch(`${IP_ADDRESS}/api/qr/scan`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: data }),
      });

      const result = await res.json();

      if (res.ok) {
        if (result.action === "salida") {
        await AsyncStorage.removeItem("reservation");
        console.log("Reserva eliminada de AsyncStorage");

      }
        Alert.alert("Éxito", result.message);
      } else {
        Alert.alert("Error", result.error || "QR no válido");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo procesar el QR");
    }
  };

  // Animación vertical
  const translateY = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"], // SOLO QR
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        {/* Overlay oscuro */}
        <View style={styles.overlay} pointerEvents="none" />

        {/* Marco del escáner */}
        <View style={styles.scannerFrame} pointerEvents="none">
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY }] },
            ]}
          />
        </View>

        {scanned && (
          <Button title="Escanear otra vez" onPress={() => setScanned(false)} />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  scannerFrame: {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: "80%",
    height: 280,
    borderColor: "#00eaff",
    borderWidth: 3,
    borderRadius: 20,
    overflow: "hidden",
  },
  scanLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#00eaff",
    opacity: 0.8,
  },
});
