import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
const IP_ADDRESS = process.env.EXPO_PUBLIC_API_URL;

export default function CrearCajon() {
  const [numero, setNumero] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCrearCajon = async () => {
    if (!numero || !ubicacion ) {
      return Alert.alert("Error", "Debes ingresar número y ubicación.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${IP_ADDRESS}/api/parking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: Number(numero),
          ubicacion,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.log("Respuesta no es JSON:", text);
        Alert.alert("Error", "El servidor no devolvió JSON válido");
        return;
      }

      if (res.ok) {
        Alert.alert("✅ Cajón creado", `Cajón #${data.numero} agregado correctamente`);
        setNumero("");
        setUbicacion("");
      } else {
        Alert.alert("Error", data.msg || data.error || "No se pudo crear el cajón");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 p-6 bg-white">
        <Text className="text-2xl font-bold mb-6">Agregar nuevo cajón</Text>

        <Text className="text-gray-700 mb-2">Número del cajón</Text>
        <TextInput
          value={numero}
          onChangeText={setNumero}
          placeholder="Ej: 1"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg p-3 mb-4"
        />

        <Text className="text-gray-700 mb-2">Ubicación</Text>
        <TextInput
          value={ubicacion}
          onChangeText={setUbicacion}
          placeholder="Ej: Nivel 1 - A1"
          className="border border-gray-300 rounded-lg p-3 mb-4"
        />

        <TouchableOpacity
          onPress={handleCrearCajon}
          className={`p-4 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Crear Cajón</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
