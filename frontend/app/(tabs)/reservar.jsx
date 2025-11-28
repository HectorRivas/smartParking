import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/ScreenWrapper";
import CardInfo from "../../components/CardInfo";
import SecondaryButton from "../../components/SecondaryButton";
import ConfirmModal from "../../components/ConfirmModal";
const IP_ADDRESS = process.env.EXPO_PUBLIC_API_URL;

export default function Reservar() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [reservationActive, setReservationActive] = useState(null);
  const [loadingReserve, setLoadingReserve] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null);
  // 🔹 Cargar usuario + verificar si existe reservación activa
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUserId(JSON.parse(userData).id);
        }
        const reservationData = await AsyncStorage.getItem("reservation");

        if (reservationData) {
          const reservation = JSON.parse(reservationData);
          // 🔹 Verificar estado REAL en backend
          const check = await fetch(
            `${IP_ADDRESS}/api/parking/reservacion/${reservation._id}`
          );
          if (check.status === 200) {
            const resJson = await check.json();
            // ❌ Si backend dice que YA NO está activa → borrar
            if (resJson.estado === "completada") {
              await AsyncStorage.removeItem("reservation");
              setReservationActive(null);
            } else {
              setReservationActive(resJson);
            }
          } else {
            // Si backend no encuentra la reservación → limpiar
            await AsyncStorage.removeItem("reservation");
            setReservationActive(null);
          }
        }
      } catch (err) {
        console.error("Error verificando reservación:", err);
      }
    };
    loadUser();
  }, []);
  // 🔹 Obtener cajones libres
  const fetchSlotsLibres = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${IP_ADDRESS}/api/parking/libres`);
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
  // 🔹 Función para reservar cajón
  const reservarCajon = async () => {
    if (!userId || !selectedSlotId)
      return Alert.alert("Error", "Ocurrió un problema.");
    if (reservationActive) {
      setModalVisible(false);
      return Alert.alert(
        "Reservación activa",
        "Ya tienes una reservación activa. Debes concluirla primero."
      );
    }
    setLoadingReserve(true);
    setModalVisible(false);
    try {
      const res = await fetch(
        `${IP_ADDRESS}/api/parking/reservar/${selectedSlotId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem(
          "reservation",
          JSON.stringify(data.reservation)
        );
        setReservationActive(data.reservation);
        Alert.alert(
          "✅ Reservación exitosa",
          `Cajón #${data.slot.numero} reservado`
        );
        fetchSlotsLibres();
      } else {
        Alert.alert("Error", data.error || "No se pudo reservar.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Problema al conectar con el servidor.");
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
              <CardInfo title={`Cajón ${item.numero}`}>
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg text-gray-900">
                    Ubicación: {item.ubicacion}
                  </Text>
                  <Text className="text-lg text-green-700 font-bold">
                    Libre
                  </Text>
                </View>
                <SecondaryButton
                  title="Reservar"
                  onPress={() => {
                    setSelectedSlotId(item._id);
                    setSelectedSlotNumber(item.numero);
                    setModalVisible(true);
                  }}
                />
              </CardInfo>
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
      <ConfirmModal
        visible={modalVisible}
        title="Confirmar reservación"
        message={`¿Deseas reservar el cajón ${selectedSlotNumber}?`}
        confirmText="Sí, reservar"
        cancelText="Cancelar"
        onCancel={() => setModalVisible(false)}
        onConfirm={reservarCajon}
      />
    </ScreenWrapper>
  );
}
