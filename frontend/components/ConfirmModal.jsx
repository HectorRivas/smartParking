import React from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";

export default function ConfirmModal({
  visible,
  title = "Confirmar acción",
  message = "¿Estás seguro de continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        
        <View className="bg-white rounded-2xl p-6 w-full max-w-[340px] shadow-lg">
          
          <Text className="text-xl font-bold text-[#073A59] mb-3 text-center">
            {title}
          </Text>

          <Text className="text-gray-700 text-center mb-6">
            {message}
          </Text>

          {/* Botones */}
          <View className="flex-row justify-between mt-2">

            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-300 px-4 py-2 rounded-xl flex-1 mr-2"
            >
              <Text className="text-center font-semibold text-gray-800">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="bg-[#0B4F6C] px-4 py-2 rounded-xl flex-1 ml-2"
            >
              <Text className="text-center font-semibold text-white">
                {confirmText}
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </Modal>
  );
}
