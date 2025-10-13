// src/components/FormModal.js

import React, { useState, useEffect } from "react";
import { Modal, View, Text, Alert, ActivityIndicator, ScrollView } from "react-native";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import DangerButton from "./DangerButton";
import InputField from "./InputField";

export default function FormModal({
  visible,
  onClose,
  title,
  formConfig, // El array de objetos que describe el formulario, ahora incluyendo 'formatFunction'
  onSave,
  // Opcional para el botón de eliminación
  showDeleteButton = false,
  onDelete = () => {}, 
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inicializar el estado de formData
  // Se ejecuta cada vez que 'formConfig' cambia (ej. cuando se abre el modal con nuevos datos)
  useEffect(() => {
    const initialData = formConfig.reduce((acc, field) => {
      // Usamos 'value' si existe, sino un string vacío.
      acc[field.id] = field.value || ""; 
      return acc;
    }, {});
    setFormData(initialData);
  }, [formConfig]);

  // 🔑 Lógica para manejar el cambio de input, aplicando formato si está definido
  const handleChange = (id, value) => {
    // 1. Obtener la configuración del campo actual
    const fieldConfig = formConfig.find((f) => f.id === id);

    let finalValue = value;
    
    // 2. Si el campo tiene una función de formato, la aplicamos al valor
    if (fieldConfig && typeof fieldConfig.formatFunction === 'function') {
      finalValue = fieldConfig.formatFunction(value);
    }
    
    // 3. Actualizar el estado con el valor final (formateado o no)
    setFormData((prev) => ({ ...prev, [id]: finalValue }));
  };

  // --- Funciones de Acción ---
  
  const handleSave = async () => {
    // Validación de campos obligatorios
    const requiredFields = formConfig.filter(
      (f) => f.required && !formData[f.id]
    );
    if (requiredFields.length > 0) {
      Alert.alert("Error", "Por favor, llena todos los campos obligatorios.");
      return;
    }

    setIsLoading(true);
    try {
      // Pasamos los datos del formulario (ya formateados si se aplicó masking) a la función onSave
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar la información. Intenta de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este elemento?",
      [
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
      ]
    );
  };

  const buttonsDisabled = isLoading || isDeleting;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="w-[90%] max-h-[80%] p-5 bg-white rounded-lg shadow-xl border-t-4 border-blue-500">
          <Text className="text-xl font-bold text-gray-800 mb-5 text-center">
            {title || "Formulario"}
          </Text>
          
          <ScrollView keyboardShouldPersistTaps="handled"> 
            {/* Renderizado Dinámico de Inputs */}
            {formConfig.map((field) => (
              <InputField
                key={field.id}
                // 🔑 Pasamos TODAS las props de configuración al InputField
                {...field}
                // Las props de estado y manejo de eventos siempre se sobreescriben
                value={formData[field.id]}
                onChangeText={(value) => handleChange(field.id, value)}
                // Si 'editable' no está definida en la configuración, es true por defecto.
                editable={field.editable ?? true}
              />
            ))}
          </ScrollView>
          
          {/* --- Botones de Acción --- */}

          <PrimaryButton
            title={isLoading ? "Guardando..." : "Guardar Cambios"}
            onPress={handleSave}
            className="mt-6 bg-blue-500"
            disabled={buttonsDisabled}
          />
          
          {showDeleteButton && (
            <DangerButton
              title={isDeleting ? "Eliminando..." : "Eliminar"}
              onPress={handleDelete}
              className="mt-3 bg-red-500"
              disabled={buttonsDisabled}
            />
          )}
          
          <SecondaryButton
            title="Cancelar"
            onPress={onClose}
            className="mt-3"
            disabled={buttonsDisabled}
          />
        </View>
      </View>
    </Modal>
  );
}