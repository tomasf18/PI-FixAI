import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';

import { FormField, SaveChangesModal, CustomButton, DeleteAccountModal } from '@/components';
import { getUserDetails, UserProfile } from '@/api';
import { useTranslation, useAuth, useSetLoading } from '@/contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Account = () => {
  const setLoading = useSetLoading();
  const { translate } = useTranslation();
  const [originalUserData, setOriginalUserData] = useState<UserProfile>({
    name: '',
    email: '',
    password: '',
  });
  const [form, setForm] = useState<UserProfile>({
    name: '',
    email: '',
    password: '',
  });
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] =
    useState(false);
  const [saveChangesModalVisible, setSaveChangesModalVisible] = useState(false);
  const [isSaveButtonActive, setSaveButtonActive] = useState(false); 
  const { token, axiosInstance } = useAuth();
  const [nameRef, setNameRef] =
    useState<React.RefObject<TextInput | undefined>>();
  const [emailRef, setEmailRef] =
    useState<React.RefObject<TextInput | undefined>>();

  useEffect(() => {
    setLoading(true);
    getUserDetails(axiosInstance)
      .then((response) => {
        console.log(response);
        setForm(response);
        setOriginalUserData(response);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log('Unauthorized');
          router.replace('/sign-in');
        } else {
          console.error('Error fetching user details:', error);
          Alert.alert(translate('error'), error.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compare form data with original user data
  useEffect(() => {
    console.log('\n\n\n\nForm data:', form);
    console.log('\nOriginal user data:', originalUserData, '\n\n\n');
    const isDifferent =
      form.name.trim() !== originalUserData.name.trim() ||
      form.email.trim() !== originalUserData.email.trim();
    setSaveButtonActive(isDifferent);
  }, [form]);

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(false);
    router.push(
      `/confirm-password?username=${form.name}&email=${form.email}&deleteParam=true`
    );
  };

  const handleSaveChanges = async () => {
    setSaveChangesModalVisible(false);
    setLoading(true);
  
    const isNameChanged = form.name.trim() !== originalUserData.name.trim();
    const isEmailChanged = form.email.trim() !== originalUserData.email.trim();
  
    // Save the updated user data locally
    await AsyncStorage.setItem('updatedUserData', JSON.stringify(form));
  
    if (isEmailChanged) {
      router.push(
        `/confirm-password?username=${form.name}&email=${form.email}&deleteParam=false&updateParam=true`
      );
    } else if (isNameChanged) {
      // Redirect to confirm-password if only the name has been changed
      router.push(
        `/confirm-password?username=${form.name}&email=${form.email}&deleteParam=false&updateParam=false`
      );
    }
    setLoading(false);
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true} className="bg-white">
      <View className="bg-white pt-6 h-full">

        <View className="items-center mb-10">
          <Text className="text-lg font-psemibold text-center">
            {translate('account_settings')}
          </Text>
          <Text className="text-gray-600 text-center font-pmedium">
            {translate('account_settings_subtitle')}
          </Text>
        </View>

        <View className="w-full px-4">
          <FormField
            setRef={setNameRef}
            handleNextInput={() => emailRef?.current?.focus()}
            title={translate('username')}
            value={form.name}
            placeholder={translate('username')}
            handleChangeText={(text) => setForm({ ...form, name: text })}
          />
          <FormField
            setRef={setEmailRef}
            isLastInput={true}
            title={translate('email')}
            value={form.email}
            placeholder={translate('email')}
            handleChangeText={(text) => setForm({ ...form, email: text.trim() })}
            otherStyles="mt-5"
          />

          <CustomButton
            title={translate('save_changes')}
            handlePress={() => setSaveChangesModalVisible(true)}
            containerStyles={`mt-7 w-full min-h-[50px] ${
              isSaveButtonActive ? '' : 'bg-gray-300'
            }`}
            disabled={!isSaveButtonActive} // Disable button if no changes
          />
        </View>

        <View className="h-full items-center pb-11 px-4">
          <CustomButton
            title={translate('delete_account')}
            handlePress={() => setDeleteAccountModalVisible(true)}
            containerStyles="mt-7 w-1/2 bg-red-500 min-h-[50px]"
          />
        </View>

        <SaveChangesModal
          title={translate('save_changes')}
          visible={saveChangesModalVisible}
          onClose={() => setSaveChangesModalVisible(false)}
          containerStyle="bg-white p-6 rounded-lg w-5/6"
          textStyle="pr-1"
          message={translate('save_changes_popup_message')}
          buttons={[
            {
              text: translate('cancel'),
              onPress: () => setSaveChangesModalVisible(false),
              style: 'bg-gray-200 mr-2 rounded-lg h-12 justify-center',
              textStyle: 'text-gray-600',
            },
            {
              text: translate('yes'),
              onPress: handleSaveChanges,
              style: 'bg-red-500 rounded-lg h-12 justify-center',
              textStyle: 'text-white',
            },
          ]}
        />

        <DeleteAccountModal
          title={translate('delete_account')}
          visible={deleteAccountModalVisible}
          onClose={() => setDeleteAccountModalVisible(false)}
          containerStyle="bg-white p-6 rounded-lg w-5/6"
          textStyle="pr-1"
          message={
              <Text>
                {translate('delete_account_popup_message_part1')}{' '}
                <Text className="font-bold text-red-500">
                  {translate('delete')}
                </Text>{' '}
                {translate('delete_account_popup_message_part2')}
              </Text>
          }
          buttons={[
            {
              text: translate('cancel'),
              onPress: () => setDeleteAccountModalVisible(false),
              style: 'bg-gray-200 mr-2 rounded-lg',
              textStyle: 'text-gray-600',
            },
            {
              text: translate('yes'),
              onPress: handleDeleteAccount,
              style: 'bg-red-500 rounded-lg',
              textStyle: 'text-white',
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};

export default Account;