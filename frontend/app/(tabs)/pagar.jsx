import { View, Text } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function PagarScreen() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg font-semibold">Pantalla Pagar</Text>
      </View>
    </ScreenWrapper>
  );
}
