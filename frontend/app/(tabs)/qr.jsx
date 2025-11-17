import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardInfo from "../../components/CardInfo";

export default function QRScreen() {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar usuario
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.nombre.split(" ")[0]); // primer nombre
        }

        // Cargar reservación activa
        const resData = await AsyncStorage.getItem("reservation");
        if (resData) {
          setReservation(JSON.parse(resData));
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        {/* Saludo */}
        <Text className="text-[#073A59] text-2xl font-inter-bold mb-8">
          Hola, {userName || "Usuario"}
        </Text>

        {/* Card QR */}
        <CardInfo title="Tu Código QR">
          <View className="items-center justify-center">
            <View
              style={{
                width: 240,
                height: 240,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
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
