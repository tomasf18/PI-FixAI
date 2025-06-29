import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';

import { images, icons } from '@/constants';
import { useTranslation, useLoading, useAuth, useSetLoading } from '@/contexts';
import { FormField, CustomButton } from '@/components';
import { forgottenPassword } from '@/api';

const ForgottenPassword = () => {
  const { translate } = useTranslation();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [emailRef, setEmailRef] = useState<React.RefObject<TextInput|undefined>>();

  const handleSubmit = async () => {
    setLoading(true);
    try {
        if (!form.email) {
            Alert.alert(translate('error'), translate('email_required'));
            return;
        }
        await forgottenPassword(axiosInstance, form.email);
        await AsyncStorage.setItem('signUpData', JSON.stringify(form));
        router.push(`/new-password?email=${form.email}`);
    } catch (error: any) {
      if (error.response?.status === 400) {
        Alert.alert(translate('error'), translate('invalid_email'));
      } else {
        Alert.alert(translate('error'), translate('unexpected_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
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
        <View className="w-full min-h-full px-4 mt-11">
          <View className="items-center h-20">
            <Text className="text-lg font-psemibold text-center">
              {translate('insert_email_title')}
            </Text>
            <Text className="text-gray-600 text-center font-pmedium">
              {translate('insert_email_subtitle')}
            </Text>
          </View>
          <FormField
            setRef={setEmailRef}
            title={translate('email')}
            value={form.email}
            handleChangeText={(text: string) => {
              form.email = text.trim(); 
              setForm({ ...form });
            }} 
            otherStyles="mt-7"
          />

          <CustomButton
            title={translate('recover_password')}
            handlePress={handleSubmit}
            containerStyles="mt-7 min-h-[62px]"
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgottenPassword;