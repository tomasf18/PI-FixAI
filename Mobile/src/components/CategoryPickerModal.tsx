import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTranslation } from '@/contexts/TranslationContext';

type CategoryPickerModalProps = {
  visible: boolean;
  categories: string[];
  onSelectCategory: (category: string) => void;
  onClose: () => void;
};

const CategoryPickerModal = ({
  visible,
  categories,
  onSelectCategory,
  onClose,
}: CategoryPickerModalProps) => {
  const { translate } = useTranslation();
  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      className="p-6 w-48 items-center"
      onPress={() => {
        onSelectCategory(item);
        onClose();
      }}
    >
      <Text className="text-lg font-semibold text-gray-800">{translate(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl max-h-[40%] min-w-[60%]">
          <View className="p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-center text-gray-800">
              {translate('select_category')}
            </Text>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingVertical: 8, alignItems: 'center' }}
          />
          <TouchableOpacity
            className="py-3 bg-gray-100 rounded-b-2xl"
            onPress={onClose}
          >
            <Text className="text-center text-gray-700 text-lg">
              {translate('cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryPickerModal;
