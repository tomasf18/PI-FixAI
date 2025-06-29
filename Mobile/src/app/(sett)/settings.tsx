import { useState, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';

import { getEmailNotifications, putEmailNotifications } from '@/api';
import { useSetLoading, useTranslation, useAuth } from '@/contexts';
import { icons } from '@/constants';

const Settings = () => {
  const { translate, changeLanguage, currentLanguage } = useTranslation();
  const [email_notifications, setEmailNotifications] = useState(false);
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState([
    { label: translate('portuguese'), value: 'pt' },
    { label: translate('english'), value: 'en' },
    { label: translate('chinese'), value: 'zh' },
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getEmailNotifications(axiosInstance)
        .then((response) => {
          setEmailNotifications(response);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log('Unauthorized');
            router.replace('/sign-in');
          }
          console.log('Error fetching email notifications:', error);
        })
        .finally(() => {
          setLoading(false);
        });
  
      return () => {
        setLoading(false); // Cleanup function
      };
    }, [axiosInstance, setLoading]) // Dependencies
  );

  const handleEmailNotificationChange = (value: boolean) => async () => {
    setLoading(true);
    setEmailNotifications(value);
    try {
      await putEmailNotifications(axiosInstance, value);
    }
    catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized');
        router.replace('/sign-in');
      }
      console.log('Error updating email notifications:', error);
    }
    setLoading(false);
  };

  const handleLanguageChange = (value: string | null) => {
    if (!value) return;
    setLoading(true);
    setTimeout(() => {
      changeLanguage(value);
      setLoading(false);
    }, 100);
  };

  return (
    <View className="bg-white h-full pt-6">
      <View className="items-center h-20">
        <Text className="text-lg font-psemibold text-center">
          {translate('settings_title')}
        </Text>
        <Text className="text-gray-600 text-center font-pmedium">
          {translate('settings_subtitle')}
        </Text>
      </View>

      <View className="h-[1px] bg-gray-200" />

      <View className="flex-row items-center justify-between h-20 px-10">
        <View className="flex-row items-center">
          <Text className="text-base font-pmedium">
            {translate('email_notifications')}
          </Text>
        </View>
        <Switch
          value={email_notifications}
          onValueChange={handleEmailNotificationChange(!email_notifications)}
        />
      </View>

      <View className="h-[1px] bg-gray-200" />

      <View className="flex-row w-full items-center justify-between h-20 px-10">
        {/* Language Label */}
        <Text className="text-base font-pmedium">{translate('language')}</Text>

        {/* Language Dropdown */}
        <View className="w-3/4">
          <DropDownPicker
            open={open}
            onChangeValue={(value) => handleLanguageChange(value)}
            value={selectedLanguage}
            items={languages}
            setOpen={setOpen}
            setValue={setSelectedLanguage}
            setItems={setLanguages}
            placeholder="Escolha um idioma..."
            placeholderStyle={{
              color: '#6b7280',
              fontSize: 16,
            }}
            style={{
              backgroundColor: 'white',
              width: '100%', // Ensures width consistency
              borderColor: '#d1d5db',
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
            dropDownContainerStyle={{
              width: '100%', // Keeps the dropdown the same width
              backgroundColor: 'white',
              borderColor: '#d1d5db',
              borderWidth: 1,
              borderRadius: 10,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
            labelStyle={{
              fontSize: 16,
              color: '#374151',
            }}
          />
        </View>
      </View>

      <View className="h-[1px] bg-gray-200" />

      <TouchableOpacity
        className="flex-row items-center justify-between px-10 h-20"
        onPress={() => router.push('/account')}
      >
        <View className="flex-row items-center">
          <Text className="text-base font-pmedium">
            {translate('account_settings')}
          </Text>
        </View>
        <Image source={icons.right} className="w-[20px] h-[20px]" />
      </TouchableOpacity>

      <View className="h-[1px] bg-gray-200" />
    </View>
  );
};

export default Settings;
