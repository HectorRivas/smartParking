import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardInfo from "../../components/CardInfo";
import { useIsFocused } from "@react-navigation/native";

export default function QRScreen() {
  const isFocused = useIsFocused(); // PARA REFRESCAR AL VOLVER
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true); // Cargar usuario
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.nombre.split(" ")[0]);
      }
      // Cargar reservación activa
      const resData = await AsyncStorage.getItem("reservation");

      // AsyncStorage devuelve un string o null; parsear antes de acceder
      let reservation = null;
      if (resData) {
        try {
          reservation = JSON.parse(resData);
          // Ahora puedes acceder a `reservation.estado`, `reservation.qrCode`, etc.
          console.log("reservation.estado", reservation.estado);
          if (reservation.estado === "completada"){
            await AsyncStorage.removeItem("reservation");
          }
        } catch (e) {
          console.warn("Error parseando 'reservation' desde AsyncStorage:", e);
        }
      }

      setReservation(reservation);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };
  // Recargar cada que la pantalla obtiene el foco
  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);
  if (loading) {
    return (
      <ScreenWrapper backgroundColor="#F2F2F2">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#618D9E" />
          <Text className="mt-4 text-gray-500">Cargando...</Text>
        </View>
      </ScreenWrapper>
    );
  }
  if (!reservation) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center">
          <Text>No tienes reservaciones activas</Text>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center w-full pt-8 mt-4">
        <Text className="text-[#073A59] text-2xl font-inter-bold mb-8">
          Hola, {userName || "Usuario"}
        </Text>
        <CardInfo title="Tu Código QR">
          <View className="items-center justify-center">
            <View
              style={{
                width: 240,
                height: 240,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                margin: 16,
              }}
            >
              <QRCode
                value={reservation.qrCode || "sin_qr"}
                size={240}
                color="#073A59"
                backgroundColor="transparent"
              />
            </View>
            <Text
              style={{
                color: "#073A59",
                textAlign: "center",
                marginHorizontal: 12,
              }}
              className={"font-inter-semibold"}
            >
              Muestra este QR al ingresar o salir del estacionamiento para
              registrar tu estancia.
            </Text>
          </View>
        </CardInfo>
      </View>
    </ScreenWrapper>
  );
}
