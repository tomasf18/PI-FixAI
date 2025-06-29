import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

const AuthLayout = () => {
  useEffect(() => {
    // set navigation bar color
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark'); // ensures icons are visible (light/dark mode)
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="confirm-code"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgotten-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-password"
        options={{
          headerShown: false,
        }}
      />
      <StatusBar backgroundColor="#ffffff" style="dark" />
    </Stack>
  );
};

export default AuthLayout;
