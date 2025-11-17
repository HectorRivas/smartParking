import React, { useState, useRef } from "react";
import { View, Text, Pressable, Image, Platform, KeyboardAvoidingView, ScrollView, Alert } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import QR from "../assets/QR4.png";
import ScreenWrapper from "../components/ScreenWrapper";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

// Pantalla: Register
// Permite crear una nueva cuenta de usuario.
export default function RegisterScreen() {
  return (
    <SafeAreaProvider>
      <RegisterContent />
    </SafeAreaProvider>
  );
}

function RegisterContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Estado de los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Referencias para los inputs (para avanzar automáticamente)
  const correoRef = useRef();
  const telefonoRef = useRef();
  const passwordRef = useRef();
  const confirmarRef = useRef();

  // Maneja el registro y navegación al iniciar sesión
  const handleRegister = async () => {
    if (!nombre || !correo || !contraseña) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    if (contraseña !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.100.81:4000/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            correo,
            telefono,
            contraseña,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Usuario registrado correctamente.");
        router.push("/login");
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar el usuario.");
      }
    } catch (error) {
      // Error de conexión al servidor
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <ScreenWrapper backgroundColor="#F2F2F2" paddingTop={insets.top}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            backgroundColor: "#F2F2F2",
          }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          {/* Encabezado */}
          <View className="justify-center items-center w-full mt-10">
            <Image source={QR} className="w-20 h-20 mb-2" />
            <Text className="text-[#073A59] text-4xl font-bold">
              Crear cuenta
            </Text>
          </View>

          {/* Formulario */}
          <View className="flex-1 justify-center items-center w-full">
            <View className="justify-center items-start m-4 p-4 w-full">
              <InputField
                label="Nombre"
                placeholder="Ingrese su nombre"
                value={nombre}
                onChangeText={setNombre}
                icon="person-outline"
                returnKeyType="next"
                onSubmitEditing={() => correoRef.current.focus()}
              />

              <InputField
                ref={correoRef}
                label="Correo electrónico"
                placeholder="Ingrese su correo electrónico"
                inputMode="email"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
                icon="mail-outline"
                returnKeyType="next"
                onSubmitEditing={() => telefonoRef.current.focus()}
              />

              <InputField
                ref={telefonoRef}
                label="Teléfono"
                placeholder="Ingrese su teléfono"
                keyboardType="phone-pad"
                inputMode="tel"
                value={telefono}
                onChangeText={setTelefono}
                icon="call-outline"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
              />

              <InputField
                ref={passwordRef}
                label="Contraseña"
                placeholder="Crear contraseña"
                secureTextEntry
                value={contraseña}
                onChangeText={setContraseña}
                icon="lock-closed-outline"
                returnKeyType="next"
                onSubmitEditing={() => confirmarRef.current.focus()}
              />

              <InputField
                ref={confirmarRef}
                label="Confirmar Contraseña"
                placeholder="Confirme su contraseña"
                secureTextEntry
                value={confirmar}
                onChangeText={setConfirmar}
                icon="lock-closed-outline"
                returnKeyType="done"

              />

              {/* Botón de registro */}
              <PrimaryButton
                title="Registrarse"
                onPress={handleRegister}
                backgroundColor="#3F8EBF"
                textColor="#FFFFFF"
                icon="person-add-outline"
              />

              {/* Enlace a login */}
              <View className="justify-center items-center mt-4 w-full">
                <Text className="text-[#3F83BF] text-lg font-bold p-1">
                  ¿Ya tienes una cuenta?
                </Text>
                <Link asChild href="/login">
                  <Pressable className="w-full items-center">
                    {({ pressed }) => (
                      <Text
                        className="text-[#3F83BF] text-lg font-bold underline"
                        style={{ color: pressed ? "#d1d1d1" : "#3F83BF" }}
                      >
                        Inicia sesión aquí
                      </Text>
                    )}
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
