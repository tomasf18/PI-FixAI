import { Tabs, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  Image,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { LogOutModal } from '@/components';
import { images, icons } from '@/constants';
import { useTranslation, useAuth } from '@/contexts';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
  cn: string;
}

const TabIcon = ({ icon, color, name, focused, cn }: TabIconProps) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={cn}
      />
    </View>
  );
};

const TabsLayout = () => {
  const { translate } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [logOutModal, setLogOutModal] = useState(false);
  const { logout } = useAuth();

  const handleLogOut = () => {
    setLogOutModal(false);
    logout();
  };

  useEffect(() => {
    // Set navigation bar color
    NavigationBar.setBackgroundColorAsync('#ffffff'); // Change to any color you want
    NavigationBar.setButtonStyleAsync('dark'); // Ensures icons are visible (light/dark mode)
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="border-b border-b-gray-100 flex-row justify-between px-7">
        <LogOutModal
          title={translate('logout_popup_title')}
          visible={logOutModal}
          onClose={() => setLogOutModal(false)}
          containerStyle="bg-white p-6 rounded-lg w-5/6"
          message={
            <Text>
              {translate('logout_popup_message_part1')}{' '}
              <Text className="font-bold text-red-500">
                {translate('exit')}
              </Text>{' '}
              {translate('logout_popup_message_part2')}
            </Text>
          }
          buttons={[
            {
              text: translate('cancel'),
              onPress: () => setLogOutModal(false),
              style: 'bg-gray-200 mr-2 rounded-lg',
              textStyle: 'text-gray-600',
            },
            {
              text: translate('yes'),
              onPress: () => {
                handleLogOut();
              },
              style: 'bg-red-500 rounded-lg',
              textStyle: 'text-white',
            },
          ]}
        />
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => router.push('/settings')}
        >
          <Image
            source={icons.settings}
            resizeMode="contain"
            className="w-[30px] h-[54px]"
          />
        </TouchableOpacity>
        {pathname !== '/home' && (
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Image
              source={images.logo}
              className="w-[100px] h-[54px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="justify-center items-center"
          onPress={() => setLogOutModal(true)}
        >
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-[30px] h-[54px]"
          />
        </TouchableOpacity>
      </View>

      {Platform.OS === 'ios' && (
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#283FB1',
            tabBarStyle: {
              width: '100%',
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.homeV2}
                  color={color}
                  name="Home"
                  focused={focused}
                  cn="w-28 h-14 p-2 p-2 ps-4 mt-2"
                />
              ),
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  className="flex-1 justify-center items-center"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="photo"
            options={{
              title: 'Photo',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.photo}
                  color={color}
                  name="Photo"
                  focused={focused}
                  cn="w-28 h-14 p-1 ps-2 mt-3"
                />
              ),
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  className="flex-1 justify-center items-center"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: 'Map',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.mapV2}
                  color={color}
                  name="Map"
                  focused={focused}
                  cn="w-28 h-14 p-1 pe-2 pt-2 mt-2"
                />
              ),
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  className="flex-1 justify-center items-center"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="list"
            options={{
              title: 'List',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.listV2}
                  color={color}
                  name="List"
                  focused={focused}
                  cn="w-28 h-14 pe-6 mt-3"
                />
              ),
              tabBarButton: (props) => (
                <Pressable
                  {...props}
                  className="flex-1 justify-center items-center"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="confirm-location"
            options={{
              title: 'Confirm Location',
              headerShown: false,
              href: null,
            }}
          />
        </Tabs>
      )}

      {Platform.OS === 'android' && (
        <Tabs
          screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#283FB1',
            tabBarStyle: {
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
              height: 50,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.home}
                  color={color}
                  name="Home"
                  focused={focused}
                  cn="w-9 h-9 mt-5"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="photo"
            options={{
              title: 'Photo',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.photo}
                  color={color}
                  name="Photo"
                  focused={focused}
                  cn="w-10 h-10 mt-5"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: 'Map',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.map}
                  color={color}
                  name="Map"
                  focused={focused}
                  cn="w-10 h-10 mt-4"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="list"
            options={{
              title: 'List',
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={icons.book}
                  color={color}
                  name="List"
                  focused={focused}
                  cn="w-11 h-11 mt-5"
                />
              ),
            }}
          />
        </Tabs>
      )}

      <StatusBar backgroundColor="#ffffff" style="dark" />
    </SafeAreaView>
  );
};

export default TabsLayout;
