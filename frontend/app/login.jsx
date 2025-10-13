import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Image,
  ActivityIndicator, // 💡 Agregado
} from "react-native";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../components/ScreenWrapper";
import QR from "../assets/QR4.png";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false);
  
  const passwordRef = useRef(); 

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña");
      return;
    }

    try {
  setLoading(true);
      const response = await fetch(
        "http://192.168.100.81:4000/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, contraseña }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Correo o contraseña incorrectos");
        return;
      }

      // Guardar usuario en AsyncStorage
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          nombre: data.user.nombre,
          correo: data.user.correo,
          telefono: data.user.telefono,
        })
      );

      // Redirigir a QR
      router.replace("/(tabs)/qr");
    } catch (error) {
      // Error de conexión al servidor
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper backgroundColor="#F2F2F2">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
            backgroundColor: "#F2F2F2",
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cabecera */}
          <View className="h-auto top-0 justify-center items-center w-full mt-0 mb-8">
            <Image source={QR} className="w-20 h-20 mb-2" />
            <Text className="text-[#073A59] text-4xl font-bold">
              Iniciar sesión
            </Text>
          </View>
          {/* Formulario */}
          <InputField
            label="Correo"
            placeholder="Ingresa tu correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            icon="mail-outline"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
          />

          <InputField
            ref={passwordRef}
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={contraseña}
            onChangeText={setContraseña}
            secureTextEntry
            icon="lock-closed-outline"
            returnKeyType="done"
            onSubmitEditing={handleLogin}

          />

          <PrimaryButton
            title={loading ? "Cargando..." : "Iniciar sesión"}
            icon="log-in-outline"
            onPress={handleLogin}
            disabled={loading}
            backgroundColor="#3F8EBF"
            textColor="#FFFFFF"
          />

          <View className="justify-center items-center mt-4 w-full">
            <Text className="text-[#3F83BF] text-lg font-bold p-1">
              ¿No tienes una cuenta?
            </Text>
            <Link asChild href="/register">
              <Pressable className="w-full items-center">
                <Text className="text-[#3F83BF] text-lg font-bold underline">
                  Regístrate aquí
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}