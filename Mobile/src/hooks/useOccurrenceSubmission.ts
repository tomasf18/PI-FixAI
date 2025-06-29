import { useSetLoading, useAuth, useTranslation, useLlm, useGeneral } from '@/contexts';
import {
  preSubmitOccurrence,
  connectIncidentWebSocket,
  LocationCoords,
} from '@/api';
import { Alert } from 'react-native';
import { resizeImage } from '@/utils';
import { router } from 'expo-router';

export const useOccurrenceSubmission = ({
  photoUri,
  locationCoords,
}: {
  photoUri: string | null;
  locationCoords: LocationCoords | null;
}) => {
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();
  const { translate } = useTranslation();
  const { setLlmResponse } = useLlm();
  const { setPreSubmitResponse } = useGeneral();

  const submit = async () => {
    if (!locationCoords) {
      Alert.alert(translate('error'), translate('location_error_message'), [
        { text: translate('ok') },
      ]);
      return;
    }

    try {
      setLoading(true);
      const resizedImageUri = await resizeImage(photoUri || '');
      console.log('Pre-submitting occurrence...');
      console.log('LOCATION OF THE PHOTO:', locationCoords);
      const response = await preSubmitOccurrence(
        axiosInstance,
        locationCoords.photo_latitude,
        locationCoords.photo_longitude,
        resizedImageUri
      );

      setPreSubmitResponse(response);

      connectIncidentWebSocket(
        response.incident_id,
        (response) => {
          setLlmResponse(response);
        },
        () => {
          console.error('WebSocket connection failed');
        }
      );

      router.push('/confirm-location');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('Unauthorized');
        router.replace('/sign-in');
      }
      console.log('Error submitting occurrence:', error);
    } finally {
      setLoading(false);
    }
  };

  return { submit };
};
