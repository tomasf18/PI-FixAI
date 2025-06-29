import { useState } from 'react';
import { Link, router } from 'expo-router';
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

import { images } from '@/constants';
import { useTranslation, useAuth, useLoading, useSetLoading } from '@/contexts';
import { FormField, CustomButton } from '@/components';

const SignIn = () => {
  const { translate } = useTranslation();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [emailRef, setEmailRef] = useState<React.RefObject<TextInput|undefined>>();
  const [passwordRef, setPasswordRef] = useState<React.RefObject<TextInput|undefined>>();

  const handleForgottenPassword = () => {
    router.push('/forgotten-password');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await login({
        username: form.email,
        password: form.password,
      });
    } catch (error: any) {
      Alert.alert(translate('error'), translate('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View className="w-full min-h-full px-4 mt-11">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="mt-10 h-[150px] w-[220px] mx-auto"
          />
          <Text className="text-3xl mt-10 font-psemibold text-center">
            {translate('sign_in_message')}
          </Text>
          <FormField
            setRef={setEmailRef}
            handleNextInput={() => passwordRef?.current?.focus()}
            title={translate('email')}
            value={form.email}
            handleChangeText={(text: string) => {
              form.email = text.trim(); // update the email value
              setForm({ ...form }); // trigger re-render
            }} // callback function where we destruct the form values and update the email value
            otherStyles="mt-7"
          />
          <FormField
            setRef={setPasswordRef}
            handleNextInput={() => handleSubmit()}
            isLastInput={true}
            title={translate('password')}
            isPassword={true}
            value={form.password}
            handleChangeText={(text: string) => {
              form.password = text.trim(); // update the password value
              setForm({ ...form }); // trigger re-render
            }}
            otherStyles="mt-7"
          />
          <TouchableOpacity onPress={() => handleForgottenPassword()}>
            <Text className="text-sm text-primary mt-2 font-pbold text-right">
              {translate('password_forgotten')}
            </Text>
          </TouchableOpacity>

          <CustomButton
            title={translate('sign_in')}
            handlePress={handleSubmit}
            containerStyles="mt-7 min-h-[62px]"
            isLoading={isLoading}
          />

          <View className="justify-center pt-4 flex-row gap-2">
            <Text className="text-sm font-plight">
              {translate('no_account')}{' '}
                <Link
                href="/sign-up"
                onPress={() => {
                  router.replace('/sign-up');
                }}
                className="text-primary font-pbold"
                >
                {translate('sign_up')}
                </Link>
            </Text>
          </View>
          <View className="w-full h-11" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
