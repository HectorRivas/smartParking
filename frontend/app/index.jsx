import { StatusBar } from "expo-status-bar";
import { View, Text, Image, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";  
import Constants from "expo-constants";
import { Link } from "expo-router";
import QR from "../assets/QR4.png";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton"; // versión secundaria opcional

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Fondo de la barra de estado */}
      <View
        style={{
          height: Platform.OS === "android" ? Constants.statusBarHeight : 0,
          backgroundColor: "#073A59",
        }}
      />
      <StatusBar style="light" backgroundColor="#073A59" />

      <View className="flex-1 bg-[#F2F2F2] justify-between items-center">
        {/* Encabezado */}
        <View className="h-20 top-0 justify-center items-center bg-[#073A59] w-full">
          <Text className="text-[#F2F2F2] text-2xl font-montserrat-bold">
            Bienvenido a
          </Text>
        </View>

        {/* Contenido principal */}
        <View className="flex-1 justify-center items-center w-full">
          <Image source={QR} className="w-40 h-40 mb-2 mt-10" />
          <Text className="text-[#073A59] text-4xl font-montserrat-bold m-1 p-1">
            Smart Parking
          </Text>
          <Text className="text-gray-400 text-lg font-montserrat-semibold m-1 p-1 text-center">
            La forma más inteligente de estacionar.
          </Text>

          {/* Botones */}
          <View className="justify-center items-center m-4 p-4 w-full">
            {/* Botón principal */}
            <Link asChild href="/login">
              <PrimaryButton title="Iniciar sesión" icon="log-in-outline" />
            </Link>

            {/* Botón secundario */}
            <Link asChild href="/register">
              <SecondaryButton title="Registrarse" icon="person-add-outline" />
            </Link>

            {/* Enlace simple */}
            <Link asChild href="/terms">
              <Text className="text-[#3F83BF] text-lg font-bold underline mt-6">
                Términos y condiciones
              </Text>
            </Link>
          </View>
          // Solo para pruebas rápidas
          <View className="justify-center items-center mt-6 w-full">
            <Link asChild href="/CrearCajon">
              <Text className="text-[#3F83BF] text-lg font-bold underline mt-2">
                Crear Cajón
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
