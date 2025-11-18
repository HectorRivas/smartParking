import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";
import CardInfo from "../../components/CardInfo";
import { useIsFocused } from "@react-navigation/native";

export default function HistorialScreen() {
  const isFocused = useIsFocused(); // 👈 REFRESCA AL VOLVER
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    } else {
      Alert.alert("Error", "No se encontró sesión activa.");
    }
  };

  const fetchReservations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://192.168.100.81:4000/api/reservations/usuario/${userId}`
      );
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      Alert.alert("Error", "No se pudo cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuario una vez
  useEffect(() => {
    loadUser();
  }, []);

  // 🔄 Recargar historial cuando vuelva a estar en foco
  useEffect(() => {
    if (isFocused) {
      fetchReservations();
    }
  }, [isFocused, userId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0B4F6C" />
          <Text className="mt-4 text-gray-500">Cargando historial...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-[#0B4F6C] mb-4 text-center">
          Historial de Reservaciones
        </Text>

        {reservations.length === 0 ? (
          <Text className="text-center text-gray-600">
            No tienes reservaciones.
          </Text>
        ) : (
          <FlatList
            data={reservations}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CardInfo
                title={`Reservación ID: ${item._id}`}
                style={{ width: "90%", marginBottom: 20 }}
              >
                <Text className="font-bold text-lg">
                  Cajón: {item.slotId?.numero || "Desconocido"}
                </Text>
                <Text>Ubicación: {item.slotId?.ubicacion || "-"}</Text>
                <Text>Estado: {item.estado}</Text>
                <Text>
                  Desde: {new Date(item.fechaInicio).toLocaleString()}
                </Text>
                <Text>
                  Hasta:{" "}
                  {item.fechaFin
                    ? new Date(item.fechaFin).toLocaleString()
                    : "—"}
                </Text>
              </CardInfo>
            )}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
