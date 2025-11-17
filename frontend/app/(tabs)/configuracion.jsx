import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import SecondaryButton from "../../components/SecondaryButton";
import DangerButton from "../../components/DangerButton";
import CardInfo from "../../components/CardInfo";
import FormModal from "../../components/FormModal";

export default function ConfiguracionScreen() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados de usuario y lógica de carga

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const handleCloseModal = () => setIsEditModalVisible(false);
  const handleOpenModal = () => setIsEditModalVisible(true);

  // Formato de número de tarjeta: inserta un espacio cada 4 dígitos
  const formatCardNumber = (text) => {
    // Limpia el texto (solo dígitos)
    const cleanText = text.replace(/[^0-9]/g, "");

    // Inserta espacios cada 4 dígitos
    let formattedText = "";
    for (let i = 0; i < cleanText.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedText += " ";
      }
      formattedText += cleanText[i];
    }

    // Limita a 19 caracteres (16 dígitos + 3 espacios)
    return formattedText.substring(0, 19);
  };

  // Formato de expiración MM/AA
  const formatExpiryDate = (text) => {
    // Limpia el texto (solo dígitos)
    const cleanText = text.replace(/[^0-9]/g, "");

    // Aplica formato "MM/AA"
    let formattedText = cleanText;

    if (cleanText.length > 2) {
      // Inserta "/" después de los 2 primeros dígitos
      formattedText = cleanText.substring(0, 2) + "/" + cleanText.substring(2);
    }

    // Limita a 5 caracteres "MM/AA"
    return formattedText.substring(0, 5);
  };

  // Configuración del formulario de usuario
  const userFormConfig = [
    {
      id: "name",
      label: "Nombre Completo",
      placeholder: "Ingresa tu nombre",
      icon: "person-outline",
      value: userName, // valor inicial
      required: true,
      editable: false, // Campo de solo lectura
      font: "inter",
    },
    {
      id: "email",
      label: "Correo Electrónico",
      placeholder: "ejemplo@dominio.com",
      icon: "mail-outline",
      keyboardType: "email-address",
      editable: true, // Campo editable
      value: userEmail, // valor inicial
      required: true,
      font: "inter",
    },
    {
      id: "phone",
      label: "Teléfono",
      placeholder: "55 1234 5678",
      icon: "call-outline",
      keyboardType: "phone-pad",
      value: userPhone, // valor inicial
      required: true,
      font: "inter",
      editable: true, // Campo editable
    },
  ];

  const cardFormConfig = [
    {
      id: "cardNumber",
      label: "Número de Tarjeta",
      placeholder: "XXXX XXXX XXXX XXXX",
      icon: "card-outline",
      keyboardType: "numeric",
      // Max 19 para 16 dígitos + 3 espacios
      maxLength: 19,
      required: true,
      // Función de formato para enmascarar
      formatFunction: formatCardNumber,
    },
    {
      id: "cardHolderName",
      label: "Nombre en la Tarjeta",
      placeholder: "Juan Pérez",
      icon: "person-outline",
      keyboardType: "default",
      required: true,
    },
    {
      id: "expiryDate",
      label: "Fecha Exp. (MM/AA)",
      placeholder: "MM/AA",
      icon: "calendar-outline",
      keyboardType: "numeric",
      // Max 5 (MM/AA)
      maxLength: 5,
      required: true,
      // Función de formato para enmascarar
      formatFunction: formatExpiryDate,
    },
    {
      id: "cvv",
      label: "CVV",
      placeholder: "XXX",
      icon: "lock-closed-outline",
      keyboardType: "numeric",
      secureTextEntry: true,
      // CVV: 3 o 4 dígitos (máx. 4)
      maxLength: 4,
      required: true,
    },
  ];

  const changePasswordFormConfig = [
    {
      id: "currentPassword",
      label: "Contraseña Actual",
      placeholder: "Ingresa tu contraseña actual",
      icon: "lock-closed-outline",
      keyboardType: "secure-text",
      secureTextEntry: true,
      required: true,
    },
    {
      id: "newPassword",
      label: "Nueva Contraseña",
      placeholder: "Ingresa tu nueva contraseña",
      icon: "lock-closed-outline",
      keyboardType: "secure-text",
      secureTextEntry: true,
    },
    {
      id: "confirmNewPassword",
      label: "Confirmar Nueva Contraseña",
      placeholder: "Confirma tu nueva contraseña",
      icon: "lock-closed-outline",
      keyboardType: "secure-text",
      secureTextEntry: true,
      required: true,
    },
  ];

  // Guarda la información editada del usuario
  const handleSaveUserInfo = async (newFormData) => {
    // newFormData contendrá: { name: 'nuevo nombre', email: 'correo', phone: 'nuevo telefono' }
    // Aquí se enviaría newFormData al backend

    // Aquí iría tu lógica de actualización de API
    // ...

    // Actualizar estados locales
    setUserName(newFormData.name);
    // ... otros estados
  };

  // Lógica para guardar nueva tarjeta
  const handleSaveNewCard = async (cardData) => {
    // Aquí iría la lógica para guardar la tarjeta en backend
    // ...
    Alert.alert("Éxito", "Nueva tarjeta agregada correctamente.");
    setIsCardModalVisible(false);
  };

  // Lógica para cambiar contraseña
  const handleChangePassword = async (passwordData) => {
    // Aquí iría la lógica para cambiar la contraseña en el backend
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;
    // Validación básica
    if (newPassword !== confirmNewPassword) {
      Alert.alert(
        "Error",
        "La nueva contraseña y su confirmación no coinciden."
      );
      return;
    }
  };

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
    // Nota: ScreenWrapper contiene un View con flex-1 — correcto para carga.
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
        className="flex-1" /* Ocupa todo el espacio vertical */
        contentContainerStyle={{
          alignItems: "center", // Centra horizontalmente
          paddingVertical: 20,
          paddingBottom: 40,
          backgroundColor: "#F2F2F2",
          flexGrow: 1, // Asegura que el contenido ocupe todo el espacio
          width: "100%", // Asegura que el contenedor de contenido use el ancho completo.
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center w-40 h-40 rounded-full border bg-white mb-8">
          <Image
            source={require("../../assets/user_icon.png")}
            className="w-24 h-24"
          />
        </View>

        <CardInfo
          title="Configuración de la cuenta"
          style={{ width: "90%", marginBottom: 20 }}
        >
          <Text className="text-gray-600 font-inter-semibold mt-4">
            Nombre: <Text className="font-inter">{userName || "N/A"}</Text>
          </Text>
          <Text className="text-gray-600 font-inter-semibold mt-2">
            Email: <Text className="font-inter">{userEmail || "N/A"}</Text>
          </Text>
          <Text className="text-gray-600 font-inter-semibold mt-2">
            Teléfono: <Text className="font-inter">{userPhone || "N/A"}</Text>
          </Text>
          {/* Usando el azul de acento #3F83BF (o el que definiste) */}
          <SecondaryButton
            title="Editar información"
            icon="create-outline"
            onPress={handleOpenModal}
            className="mt-4 bg-[#3F8EBF]"
          />
        </CardInfo>

        <CardInfo
          title="Métodos de pago"
          style={{ width: "90%", marginBottom: 20 }}
        >
          <Text className="text-gray-600 mt-4">
            No hay métodos de pago registrados.
          </Text>
          <SecondaryButton
            title="Agregar método de pago"
            icon="card-outline"
            onPress={() => setIsCardModalVisible(true)}
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
            onPress={() => setIsChangePasswordModalVisible(true)}
            className="mt-4 bg-[#3F8EBF]"
          />
        </CardInfo>

        <DangerButton
          title="Cerrar sesión"
          icon="log-out-outline"
          onPress={() => {
            Alert.alert(
              "Cerrar sesión",
              "¿Estás seguro de que deseas cerrar sesión?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Cerrar sesión",
                  onPress: async () => {
                    await AsyncStorage.removeItem("user");
                    router.replace("/login");
                  },
                },
              ]
            );
          }}
        />
      </ScrollView>
      {/* Modal: editar información de usuario */}
      <FormModal
        visible={isEditModalVisible}
        onClose={handleCloseModal}
        title="Editar Información de Cuenta" /* Título dinámico */
        formConfig={userFormConfig} /* Pasamos la configuración */
        onSave={handleSaveUserInfo}
      />
      {/* Modal: agregar nueva tarjeta */}
      <FormModal
        visible={isCardModalVisible}
        onClose={() => setIsCardModalVisible(false)}
        title="Agregar Nueva Tarjeta"
        formConfig={cardFormConfig}
        onSave={handleSaveNewCard} // Función que maneja la lógica de guardar
      />
      {/* Modal: cambiar contraseña */}
      <FormModal
        visible={isChangePasswordModalVisible}
        onClose={() => setIsChangePasswordModalVisible(false)}
        title="Cambiar Contraseña"
        formConfig={changePasswordFormConfig}
        onSave={handleChangePassword} // Función que maneja la lógica de cambiar contraseña
      />
    </ScreenWrapper>
  );
}
