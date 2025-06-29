import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';

import { FormField, CustomButton } from '@/components';
import { useTranslation, useAuth, useSetLoading } from '@/contexts';
import { UserProfile, putUserProfile, deleteUserAccount } from '@/api';

const ConfirmPassword: React.FC = () => {
  const { translate } = useTranslation();
  const setLoading = useSetLoading();
  const { axiosInstance, logout, addToken } = useAuth();
  const [password, setPassword] = useState('');
  const { username, email, deleteParam, updateParam } = useLocalSearchParams();
  const isUpdate = updateParam === 'true';
  const delete_account = deleteParam === 'true';
  const [passRef, setPassRef] = useState<React.RefObject<TextInput | undefined>>();
  console.log(updateParam)
  const user_profile: UserProfile = {
    name: Array.isArray(username) ? username[0] : username,
    email: Array.isArray(email) ? email[0] : email,
    password: password,
  };

  const handleConfirmPassword = async () => {
    setLoading(true);

    if (delete_account) {
      try {
        await deleteUserAccount(axiosInstance, user_profile);
        Alert.alert(
          translate('deleted_account_popup_title'),
          translate('deleted_account_popup_message')
        );
        await logout();
      } catch (error: any) {
          console.error('Unexpected error deleting account:', error);
      } finally {
        setLoading(false);
      }
    } else if (isUpdate) {
      try {
        console.log('É UPDATE...');
        const updatedUserData = await AsyncStorage.getItem('updatedUserData');
        if (updatedUserData) {
          const parsedUpdatedUserData = JSON.parse(updatedUserData) as UserProfile;
          user_profile.email = parsedUpdatedUserData.email;
          user_profile.name = parsedUpdatedUserData.name;
          await putUserProfile(axiosInstance, user_profile, false);
          router.push('/confirm-code?type=update');
        }
      } catch (error: any) {
        if (error.response?.status === 400) {
          Alert.alert(translate('error'), translate('invalid_operation'));
        } else {
          console.error('Unexpected error saving changes:', error);
        }
      } finally {
        setLoading(false);
      }
    } else { 
      try {
        const response = await putUserProfile(axiosInstance, user_profile, true);
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        await addToken("access_token", access_token, true, true);
        await addToken("refresh_token", refresh_token, false, true);
        Alert.alert(
          translate('success'),
          translate('changes_saved_successfully')
        );
        router.replace('/home');
      } catch (error: any) {
        if (error.response?.status === 400) {
          Alert.alert(translate('error'), translate('incorrect_password'));
        } else {
          console.error('Unexpected error saving changes:', error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white pt-6 h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true} className="bg-white">
        <View className="w-full min-h-full px-4 mt-5">
          <View className="items-center h-20">
            <Text className="text-lg font-psemibold text-center">
              {translate('confirm_password_title')}
            </Text>
            <Text className="text-gray-600 text-center font-pmedium">
              {!delete_account && translate('confirm_password_subtitle_changes')}
              {delete_account && translate('confirm_password_subtitle_delete')}
            </Text>
          </View>
          <FormField
            setRef={setPassRef}
            handleNextInput={() => handleConfirmPassword()}
            isPassword={true}
            isLastInput={true}
            title={translate('password')}
            value={password}
            placeholder=""
            handleChangeText={(text) => setPassword(text.trim())}
            otherStyles="mt-5"
          />
          <CustomButton
            title={translate('confirm')}
            handlePress={handleConfirmPassword}
            containerStyles="mt-7 w-1/2 min-h-[50px]"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmPassword;
