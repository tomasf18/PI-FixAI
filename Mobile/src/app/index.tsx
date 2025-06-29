import React from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '@/constants';
import { CustomButton } from '@/components';
import { useTranslation } from '@/contexts';

import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Ignore all log notifications

const HomePage = () => {
  const { translate } = useTranslation();

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full h-full justify-center items-center px-5">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain" // Means the image will resize to fit the container size (130x84)
          />
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-center">
              {translate('index_call')}
            </Text>
          </View>
          <Text className="text-sm font-pregular mt-7 text-center">
            {translate('index_call_subtitle')}
          </Text>
          <CustomButton
            title={translate('index_button')}
            handlePress={() => router.replace('/sign-in')}
            containerStyles="w-full mt-7 min-h-[62px]"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#ffffff" style="dark" />
    </SafeAreaView>
  );
};

export default HomePage;
