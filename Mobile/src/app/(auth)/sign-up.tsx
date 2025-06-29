import { useState } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScrollView,
  Text,
  View,
  Image,
  Alert,
  TextInput,
} from 'react-native';

import { images } from '@/constants';
import { FormField, CustomButton } from '@/components';
import { useTranslation, useAuth, useLoading, useSetLoading } from '@/contexts';

const SignUp = () => {
  const { translate } = useTranslation();
  const { signup } = useAuth();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [nameRef, setNameRef] =
    useState<React.RefObject<TextInput | undefined>>();
  const [emailRef, setEmailRef] =
    useState<React.RefObject<TextInput | undefined>>();
  const [passwordRef, setPasswordRef] =
    useState<React.RefObject<TextInput | undefined>>();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('signUpData', JSON.stringify(form));
      await signup(form.email);
    } catch (error: any) {
      Alert.alert(translate('error'), translate('error_sign_up'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View className="w-full min-h-full px-4 mt-5">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="mt-10 h-[150px] w-[220px] mx-auto"
          />
          <Text className="text-3xl mt-5 font-psemibold text-center">
            {translate('sign_up_message')}
          </Text>
          <FormField
            setRef={setNameRef}
            handleNextInput={() => emailRef?.current?.focus()}
            title={translate('username')}
            value={form.name}
            handleChangeText={(text: string) => {
              form.name = text; // update the password value
              setForm({ ...form }); // trigger re-render
            }} // Callback function where we destruct the form values and update the email value
            otherStyles="mt-5"
          />
          <FormField
            setRef={setEmailRef}
            handleNextInput={() => passwordRef?.current?.focus()}
            title={translate('email')}
            value={form.email}
            handleChangeText={(text: string) => {
              form.email = text.trim(); // update the email value
              setForm({ ...form }); // trigger re-render
            }} // Callback function where we destruct the form values and update the email value
            otherStyles="mt-5"
          />
          <FormField
            setRef={setPasswordRef}
            handleNextInput={() => handleSubmit()}
            isLastInput={true}
            isPassword={true}
            title={translate('password')}
            value={form.password}
            handleChangeText={(text: string) => {
              form.password = text.trim(); // update the password value
              setForm({ ...form }); // trigger re-render
            }}
            otherStyles="mt-5"
          />

          <CustomButton
            title={translate('sign_up')}
            handlePress={handleSubmit}
            containerStyles="mt-7 min-h-[62px]"
            isLoading={isLoading}
          />

          <View className="justify-center pt-4 flex-row gap-2">
            <Text className="text-sm font-plight">
              {translate('have_account')}{' '}
              <Link
                href="/sign-in"
                onPress={() => {
                  router.replace('/sign-in');
                }}
                className="text-primary font-pbold"
              >
                {translate('sign_in')}
              </Link>
            </Text>
          </View>
          <View className="w-full h-11" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
