import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Pressable, ScrollView, Image } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import SecondaryButton from "../../components/SecondaryButton";
import DangerButton from "../../components/DangerButton";
import CardInfo from "../../components/CardInfo";


export default function ConfiguracionScreen() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const user = JSON.parse(userData);

          setUserId(user.id);
          setUserName(user.nombre);
          setUserEmail(user.correo);
          setUserPhone(user.telefono);
        } else {
          // Si no hay userData, mostrar alerta
          Alert.alert("Error de Sesión", "No se encontró sesión de usuario.");
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    // Nota: El ScreenWrapper aquí tiene un View interno con flex-1, que está bien para la pantalla de carga.
    return (
      <ScreenWrapper backgroundColor="#F2F2F2">
        <View className="flex-1 justify-center items-center bg-[#F2F2F2]">
          <ActivityIndicator size="large" color="#618D9E" />
          <Text className="mt-4 text-gray-500">Cargando...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // --- Contenido de Configuración ---
  return (
    <ScreenWrapper>
      <ScrollView
        className="flex-1" // Hace que el ScrollView ocupe todo el espacio vertical disponible.
        contentContainerStyle={{
          alignItems: "center", // Centra los elementos hijos horizontalmente.
          paddingVertical: 20,
          paddingBottom: 40,
          backgroundColor: "#F2F2F2",
          flexGrow: 1, // <--- CLAVE: Asegura que el contenido ocupe todo el espacio.
          width: "100%", // Asegura que el contenedor de contenido use el ancho completo.
        }}
        showsVerticalScrollIndicator={false}
      >

        
        <View className="items-center justify-center w-40 h-40 rounded-full border bg-white mb-8">
          <Image source={require("../../assets/user_icon.png")} className="w-24 h-24" />
        </View>
        
        <CardInfo title="Configuración de la cuenta" style={{ width: "90%", marginBottom: 20 }}>
          <Text className="text-gray-600 font-semibold mt-4">
            Nombre: <Text className="font-normal">{userName || "N/A"}</Text>
          </Text>
          <Text className="text-gray-600 font-semibold mt-2">
            Email: <Text className="font-normal">{userEmail || "N/A"}</Text>
          </Text>
          <Text className="text-gray-600 font-semibold mt-2">
            Teléfono:{" "}
            <Text className="font-normal">{userPhone || "N/A"}</Text>
          </Text>
          {/* Usando el azul de acento #3F83BF (o el que definiste) */}
          <SecondaryButton
            title="Editar información"
            icon="create-outline"
            onPress={() => Alert.alert("Aqui formulario para editar info")}
            className="mt-4 bg-[#3F8EBF]" 
          />
        </CardInfo>
        
        <CardInfo title="Métodos de pago" style={{ width: "90%", marginBottom: 20 }}>
          <Text className="text-gray-600 mt-4">
            No hay métodos de pago registrados.
          </Text>
          <SecondaryButton
            title="Agregar método de pago"
            icon="card-outline"
            onPress={() => Alert.alert("Aqui formulario para agregar metodo de pago")}
            className="mt-4 bg-[#3F8EBF]"
          />
        </CardInfo>
        
        <CardInfo title="Seguridad" style={{ width: "90%", marginBottom: 20 }}>
          <Text className="text-gray-600 mt-4">
            Cambia tu contraseña regularmente para mantener tu cuenta segura.
          </Text>
          <SecondaryButton
            title="Cambiar contraseña"
            icon="shield-checkmark-outline"
            onPress={() => Alert.alert("Aqui formulario para cambiar contraseña")}
            className="mt-4 bg-[#3F8EBF]"
          />
        </CardInfo>
        
        <DangerButton
          title="Cerrar sesión"
          icon="log-out-outline"
          onPress={() => {
            Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Cerrar sesión",
                onPress: async () => {
                  await AsyncStorage.removeItem("user");
                  router.replace("/login");
                },
              },
            ]);
          }}
        />
        
      </ScrollView>
    </ScreenWrapper>
  );
}
