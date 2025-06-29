import { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  View,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

import { icons, images } from '@/constants';
import { useAuth, useTranslation, useLoading, useSetLoading } from '@/contexts';
import { confirmCode, ConfirmationCode, confirmCodeUpdate, resendCode } from '@/api';
import { OTPInput, CustomButton } from '@/components';

const ConfirmCode = () => {
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const { translate } = useTranslation();
  const { axiosInstance, addToken } = useAuth();
  const [code, setCode] = useState('');
  const [userData, setUserData] = useState<ConfirmationCode | null>(null);
  const { type } = useLocalSearchParams(); // Retrieve the query parameter

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const key = type === 'update' ? 'updatedUserData' : 'signUpData'; // Determine the key
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const parsedData: ConfirmationCode = JSON.parse(data);
          setUserData(parsedData);
        } else {
          Alert.alert(translate('error'), translate('data_not_found'));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert(translate('error'), translate('unexpected_error'));
      }
    };

    fetchUserData();
  }, [type]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (userData) {
        const confirmationData: ConfirmationCode = {
          ...userData,
          code: code, // Add the confirmation code
        };

        // Pass `update` based on the type
        const update = type === 'update';
        if (update) {
          const response = await confirmCodeUpdate(axiosInstance, confirmationData);
          const access_token = response.data.access_token;
          const refresh_token = response.data.refresh_token;
          await addToken('access_token', access_token, true, true);
          await addToken('refresh_token', refresh_token, false, true);
        } else {
          await confirmCode(axiosInstance, confirmationData);
        }

        Alert.alert(translate('success'), translate('email_validated_successfully'));
        update ? router.replace('/home') : router.replace('/sign-in');
      } else {
        Alert.alert(translate('error'), translate('unexpected_error'));
      }
    } catch (error: any) {
      console.error('Error confirming code:', error);
      Alert.alert(translate('error'), translate('invalid_confirmation_code'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      if (userData) {
        await resendCode(axiosInstance, userData.email);
        Alert.alert(translate('success'), translate('code_resent'));
      } else {
        Alert.alert(translate('error'), translate('unexpected_error'));
      }
    } catch (error: any) {
      console.error('Error resending code:', error);
      Alert.alert(translate('error'), translate('unexpected_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full px-4">
      { type === 'update' && <View className="border-b border-b-gray-100 flex-row px-7 items-center">
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
            </View>}
      <ScrollView>
        <View className="items-center justify-center mt-10">
          <Image
            source={icons.mail}
            className="w-[100px] h-[54px]"
            resizeMode="contain"
          />
          <Text className="text-xl font-pregular w-4/5 text-center">
            {translate('confirmation_code_text')}
            {'\n'}
            <Text className="font-psemibold">{userData?.email}</Text>
          </Text>
        </View>
        <View className="mt-8">
          <View className="items-center">
            <OTPInput value={code} onChangeText={setCode} />
            <TouchableOpacity
              className="flex-row items-center mt-4"
              onPress={handleResendCode}
            >
              <Text className="text-primary font-psemibold">
              {translate('resend_code')}
              </Text>
            </TouchableOpacity>
            <CustomButton
              title={translate('confirm')}
              handlePress={handleSubmit}
              containerStyles="mt-8 min-h-[50px] h-[50px] min-w-[300px] w-[300px]"
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmCode;