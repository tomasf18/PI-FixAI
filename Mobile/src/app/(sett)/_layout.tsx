import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images, icons } from '@/constants';

const SettingsLayout = () => {
  useEffect(() => {
    // Set navigation bar color
    NavigationBar.setBackgroundColorAsync('#ffffff'); // Change to any color you want
    NavigationBar.setButtonStyleAsync('dark'); // Ensures icons are visible (light/dark mode)
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="border-b border-b-gray-100 flex-row px-7 items-center">
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => router.back()}
        >
          <Image
            source={icons.back}
            resizeMode="contain"
            className="w-[30px] h-[54px]"
          />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center" onPress={() => {router.push('/home')}}>
          <Image
            source={images.logo}
            className="w-[100px] h-[54px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* invisible spacer to balance layout */}
        <View className="w-[30px]" />
      </View>
      <Stack>
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="confirm-password"
          options={{
            headerShown: false,
          }}
        />
        <StatusBar backgroundColor="#ffffff" style="dark" />
      </Stack>
    </SafeAreaView>
  );
};

export default SettingsLayout;
