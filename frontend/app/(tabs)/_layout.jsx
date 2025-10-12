import { Tabs } from "expo-router";
import BottomTabs from "../../components/BottomTabs";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabs {...props} />}
    >
      <Tabs.Screen name="reservar" options={{ title: "Reservar" }} />
      <Tabs.Screen name="pagar" options={{ title: "Pagar" }} />
      <Tabs.Screen name="qr" options={{ title: "QR" }} />
      <Tabs.Screen name="historial" options={{ title: "Historial" }} />
      <Tabs.Screen name="configuracion" options={{ title: "Configuración" }} />
    </Tabs>
  );
}
