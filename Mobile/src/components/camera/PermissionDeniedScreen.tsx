import React from 'react';
import { View, Text } from 'react-native';
import * as Linking from 'expo-linking';
import CustomButton from '@/components/CustomButton';
import { useTranslation } from '@/contexts/TranslationContext';

const PermissionDeniedScreen = () => {
  const { translate } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold text-center">
        {translate('necessary_permissions')}
      </Text>
      <CustomButton
        title={translate('open_settings')}
        handlePress={Linking.open_settings}
        containerStyles="mt-5 w-1/2 min-h-[62px]"
      />
    </View>
  );
};

export default PermissionDeniedScreen;
