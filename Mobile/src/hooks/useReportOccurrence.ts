import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useSetLoading, useTranslation } from '@/contexts';
import { SubmitOccurrence, submitOccurrence } from '@/api';

export const useReportOccurrence = (axiosInstance: any, onClose: () => void) => {
  const setLoading = useSetLoading();
  const { translate } = useTranslation();
  const router = useRouter();

  const report = async (
    occurrenceData: SubmitOccurrence,
    selectedCategory: string,
    description: string
  ) => {
    // Step 1: Validate that description and category are non-empty
    if (!description.trim()) {
      Alert.alert(
        translate('error'),
        translate('description_required_message'),
        [{ text: translate('ok') }]
      );
      return;
    }

    if (!selectedCategory) {
      Alert.alert(
        translate('error'),
        translate('category_required_message'),
        [{ text: translate('ok') }]
      );
      return;
    }

    // Step 2: Proceed with submission if validation passes
    setLoading(true);
    try {
      await submitOccurrence(axiosInstance, occurrenceData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized');
        router.replace('/sign-in');
      }
      console.log('Error submitting occurrence:', error);
    } finally {
      setLoading(false);
      onClose();
      router.push('/list');
    }
  };

  return { report };
};
