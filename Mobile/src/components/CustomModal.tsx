import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

interface ModalButton {
  text: string;
  onPress: () => void;
  style?: string; // Tailwind classes
  textStyle?: string; // Tailwind classes for text
}

interface CustomModalProps {
  title: string;
  message: string | React.ReactNode; // Pode aceitar JSX para formatação
  visible: boolean;
  onClose: () => void;
  buttons: ModalButton[];
  containerStyle?: string; // Tailwind classes para o container
  textStyle?: string; // Tailwind classes para o texto
}

const CustomModal = ({
  title,
  message,
  visible,
  onClose,
  buttons,
  containerStyle = 'bg-white p-6 rounded-lg w-4/5',
  textStyle = 'mt-2 text-base text-gray-700',
}: CustomModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className={containerStyle}>
          <Text className="text-lg font-bold">{title}</Text>
          <Text className={textStyle}>{message}</Text>
          <View className="mt-5 flex-row justify-end">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                className={`px-6 py-3 ${button.style || ''}`}
              >
                <Text className={button.textStyle || 'text-gray-600'}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
