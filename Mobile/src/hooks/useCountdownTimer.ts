import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useGeneral } from '@/contexts';

interface UseCountdownTimerProps {
  initialTime: number;
  onExpire: () => void;
  alertTitle: string;
  alertMessage: string;
  alertConfirmText: string;
}

export const useCountdownTimer = ({
  initialTime,
  onExpire,
  alertTitle,
  alertMessage,
  alertConfirmText,
}: UseCountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const { photoUri, setPhotoUri } = useGeneral();

  useEffect(() => {
    setTimeLeft(initialTime);

    if (initialTime > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (!photoUri) {
            console.log("Photo URI is null, stopping timer.");
            clearInterval(timer);
            return 0;
          }
          if (prev <= 1) {
            clearInterval(timer);
            Alert.alert(
              alertTitle,
              alertMessage,
              [
                {
                  text: alertConfirmText,
                  onPress: onExpire,
                },
              ],
              { cancelable: false }
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [initialTime, photoUri]);

  return timeLeft;
};
