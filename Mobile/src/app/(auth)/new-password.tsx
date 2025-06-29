import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { NewPasswordRequest, confirmNewPassword } from '@/api';

const NewPassword = () => {
  const { translate } = useTranslation();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();
  const { email } = useLocalSearchParams();
  const [form, setForm] = useState({
    code: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [codeRef, setCodeRef] =
        useState<React.RefObject<TextInput | undefined>>();
  const [passRef, setPassRef] =
    useState<React.RefObject<TextInput | undefined>>();
  const [confirmNewPassRef, setConfirmNewPassRef] =
    useState<React.RefObject<TextInput | undefined>>();

  const passwordsMatch = form.newPassword === form.confirmNewPassword;

  const handleSubmit = async () => {
    if (!passwordsMatch) {
      Alert.alert(translate('error'), translate('passwords_do_not_match'));
      return;
    }

    setLoading(true);
    try {
      const newPasswordRequest: NewPasswordRequest = {
        code: form.code,
        email: email as string,
        new_password: form.newPassword,
      };
      console.log("newPasswordRequest", newPasswordRequest);
      await confirmNewPassword(axiosInstance, newPasswordRequest);
      router.push('/sign-in');
    } catch (error: any) {
      Alert.alert(translate('error'), translate('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View className="w-full min-h-full">
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
                {translate('new_password')}
              </Text>
              <Text className="text-gray-600 text-center font-pmedium">
                {translate('new_password_subtitle')}
              </Text>
            </View>
          
            <FormField
              setRef={setCodeRef}
              handleNextInput={() => passRef?.current?.focus()}
              isLastInput={false}
              title={translate('code_sent')}
              isPassword={false}
              value={form.code}
              handleChangeText={(text: string) => {
                form.code = text.trim();
                setForm({ ...form });
              }}
              otherStyles="mt-7"
            />
            <FormField
              setRef={setPassRef}
              handleNextInput={() => confirmNewPassRef?.current?.focus()}
              isLastInput={false}
              title={translate('new_password')}
              isPassword={true}
              value={form.newPassword}
              handleChangeText={(text: string) => {
                form.newPassword = text.trim();
                setForm({ ...form });
              }}
              otherStyles="mt-7"
            />
            <FormField
              setRef={setConfirmNewPassRef}
              handleNextInput={() => handleSubmit()}
              isLastInput={true}
              title={translate('confirm_new_password')}
              isPassword={true}
              value={form.confirmNewPassword}
              handleChangeText={(text: string) => {
                form.confirmNewPassword = text.trim();
                setForm({ ...form });
              }}
              otherStyles="mt-7"
            />

            {!passwordsMatch && (
              <Text className="text-sm text-red-500 mt-2">
                {translate('passwords_do_not_match')}
              </Text>
            )}

            <CustomButton
              title={translate('confirm_new_password')}
              handlePress={handleSubmit}
              containerStyles="mt-7 min-h-[62px]"
              isLoading={isLoading}
              disabled={!passwordsMatch || isLoading} // Disable button if passwords don't match or loading
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewPassword;
