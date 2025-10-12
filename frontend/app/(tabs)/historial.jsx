import { View, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function HistorialScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-2xl font-bold text-gray-800">Historial</Text>
        <Text className="text-gray-600 mt-2">Aquí puedes ver tu historial de actividades.</Text>
      </View>
    </ScreenWrapper>
  );
} 