import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';

import '@/global.css';
import { LoadingOverlay } from '@/components';
import {
  TranslationProvider,
  AuthProvider,
  LoadingProvider,
  LocationProvider,
  PermissionsProvider,
  LlmProvider,
  GeneralProvider
} from '@/contexts';

SplashScreen.preventAutoHideAsync(); // "Prevent the splash screen from hiding automatically."

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync(); // "Hide the splash screen when the fonts are loaded." (SplashScreen is a component that comes from the expo-router package.)
    if (!fontsLoaded && !error) return; // "If the fonts are not loaded, return."
  }, [fontsLoaded, error]); // Means "recall this function whenever the value of fontsLoaded changes or there is an error."

  return (
    <AuthProvider>
      <GeneralProvider>
        <LlmProvider>
          <PermissionsProvider>
            <LocationProvider>
              <TranslationProvider>
                <LoadingProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="(sett)" />
                  </Stack>
                  <LoadingOverlay />
                </LoadingProvider>
              </TranslationProvider>
            </LocationProvider>
          </PermissionsProvider>
        </LlmProvider>
      </GeneralProvider>
    </AuthProvider>
  );
};

export default RootLayout;
