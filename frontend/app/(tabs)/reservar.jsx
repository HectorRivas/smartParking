import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function Reservar() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [loadingReserve, setLoadingReserve] = useState(false);

  // Cargar el usuario desde AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
      } else {
        Alert.alert("Error", "No se encontró sesión activa.");
      }
    };
    loadUser();
  }, []);

  // Obtener lista de cajones libres
  const fetchSlotsLibres = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://192.168.100.81:4000/api/parking/libres");
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron cargar los cajones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsLibres();
  }, []);

  // Función para reservar un cajón
  const reservarCajon = async (slotId) => {
    if (!userId) return Alert.alert("Error", "Usuario no encontrado.");

    setLoadingReserve(true);

    try {
      const res = await fetch(
        `http://192.168.100.81:4000/api/parking/reservar/${slotId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Guardar la reservación en AsyncStorage
        await AsyncStorage.setItem("reservation", JSON.stringify(data.reservation));

        Alert.alert(
          "✅ Reservación exitosa",
          `Cajón #${data.slot.numero} reservado`
        );
        fetchSlotsLibres();
      } else {
        Alert.alert("Error", data.error || "No se pudo reservar el cajón.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    } finally {
      setLoadingReserve(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0B4F6C" />
          <Text className="mt-4">Cargando cajones disponibles...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="p-4 flex-1">
        <Text className="text-2xl font-semibold text-[#0B4F6C] mb-4 text-center">
          Cajones disponibles
        </Text>

        {slots.length === 0 ? (
          <Text className="text-center text-gray-600">
            No hay cajones libres por ahora.
          </Text>
        ) : (
          <FlatList
            data={slots}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 bg-green-500 rounded-xl mb-3"
                disabled={loadingReserve}
                onPress={() => reservarCajon(item._id)}
              >
                <Text className="text-white font-bold text-lg">
                  Cajón {item.numero}
                </Text>
                <Text className="text-white">{item.ubicacion}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {loadingReserve && (
          <View className="mt-4 flex-row justify-center">
            <ActivityIndicator size="large" color="#0B4F6C" />
            <Text className="ml-2 text-[#0B4F6C]">Reservando...</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
