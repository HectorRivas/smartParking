import React, { useState, useEffect } from "react";
import { Modal, View, Text, Alert, ActivityIndicator, ScrollView } from "react-native";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import DangerButton from "./DangerButton";
import InputField from "./InputField";

// Componente: FormModal
// Modal reutilizable que renderiza campos dinámicos definidos por 'formConfig'.
export default function FormModal({
  visible,
  onClose,
  title,
  formConfig,
  onSave,
  showDeleteButton = false,
  onDelete = () => {},
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicializa formData cuando cambia la configuración del formulario
  useEffect(() => {
    const initialData = formConfig.reduce((acc, field) => {
      acc[field.id] = field.value || "";
      return acc;
    }, {});
    setFormData(initialData);
  }, [formConfig]);

  // Actualiza un campo, aplicando formateo si el campo lo define
  const handleChange = (id, value) => {
    const fieldConfig = formConfig.find((f) => f.id === id);
    let finalValue = value;
    if (fieldConfig && typeof fieldConfig.formatFunction === "function") {
      finalValue = fieldConfig.formatFunction(value);
    }
    setFormData((prev) => ({ ...prev, [id]: finalValue }));
  };

  const handleSave = async () => {
    const requiredFields = formConfig.filter((f) => f.required && !formData[f.id]);
    if (requiredFields.length > 0) {
      Alert.alert("Error", "Por favor, completa los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Mostrar error al usuario; no exponemos detalles en consola aquí
      Alert.alert("Error", "No se pudo guardar la información. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirmar Eliminación", "¿Deseas eliminar este elemento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            await onDelete(formData);
            onClose();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el elemento.");
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const buttonsDisabled = isLoading || isDeleting;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="w-[90%] max-h-[80%] p-5 bg-white rounded-lg shadow-xl border-t-4 border-blue-500">
          <Text className="text-xl font-bold text-gray-800 mb-5 text-center">{title || "Formulario"}</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            {formConfig.map((field) => (
              <InputField
                key={field.id}
                {...field}
                value={formData[field.id]}
                onChangeText={(value) => handleChange(field.id, value)}
                editable={field.editable ?? true}
              />
            ))}
          </ScrollView>

          <PrimaryButton title={isLoading ? "Guardando..." : "Guardar Cambios"} onPress={handleSave} className="mt-6 bg-blue-500" disabled={buttonsDisabled} />

          {showDeleteButton && (
            <DangerButton title={isDeleting ? "Eliminando..." : "Eliminar"} onPress={handleDelete} className="mt-3 bg-red-500" disabled={buttonsDisabled} />
          )}

          <SecondaryButton title="Cancelar" onPress={onClose} className="mt-3" disabled={buttonsDisabled} />
        </View>
      </View>
    </Modal>
  );
}