import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { MotiView } from 'moti';

import { images, icons } from '@/constants';
import { StatsCard } from '@/components';
import {
  useTranslation,
  useAuth,
  useSetLoading,
  usePermissions,
} from '@/contexts';
import { getUserOccurrenceDetails, OccurrenceStatsResponse } from '@/api';

const Home = () => {
  const { translate } = useTranslation();
  const { permissions, requestPermissions } = usePermissions();
  const [userOccurrenceDetails, setUserOccurrenceDetails] =
    useState<OccurrenceStatsResponse>({} as OccurrenceStatsResponse);
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();

  // Check if permissions are granted
  useEffect(() => {
    const askIfMissing = async () => {
      if (!permissions.camera?.granted || !permissions.location?.granted) {
        await requestPermissions();
      }
    };
    askIfMissing();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getUserOccurrenceDetails(axiosInstance)
        .then((response) => {
          setUserOccurrenceDetails(response);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log('Unauthorized');
            router.replace('/sign-in');
          }
          console.log('Error fetching user occurrence details:', error);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => {
        setUserOccurrenceDetails({} as OccurrenceStatsResponse);
        setLoading(false);
        // Cleanup function to reset state or perform any necessary cleanup
        // when the component is unmounted or the screen is blurred
      };
    }, [])
  );

  return (
    <ScrollView className="bg-white">
      <View className="w-full px-7 pt-5">
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          className="items-center mb-6"
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="h-[120px] w-[200px] mx-auto"
          />
          <Text className="text-3xl font-bold text-center mt-3">
            {translate('home_message')}{' '}
            <Text className="text-primary">{userOccurrenceDetails.name}</Text>!
          </Text>
        </MotiView>
        {/* Take Picture for accessibility */}
        <TouchableOpacity
          onPress={() => router.push('/photo')}
          className="w-full"
          activeOpacity={0.8}
        >
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 100 }}
            className="flex-row items-center justify-center bg-primary rounded-2xl py-8 px-4 shadow-md"
          >
            <View className="flex-row items-center gap-x-4">
              <Image
                source={icons.photo}
                className="w-10 h-10"
                tintColor="#ffffff"
              />
              <Text className="text-2xl font-semibold text-white">
                {translate('report_occurrence')}
              </Text>
            </View>
          </MotiView>
        </TouchableOpacity>

        {/* Statistics */}
        <View className="mt-6 gap-y-4 mb-10">
          <StatsCard
            icon={icons.pending}
            label={translate('pending')}
            value={userOccurrenceDetails.pendingOccurrences}
            filter="pending"
            delay={300}
          />

          <StatsCard
            icon={icons.in_progress}
            label={translate('in_progress')}
            value={userOccurrenceDetails.inProgressOccurrences}
            filter="in_progress"
            delay={600}
          />

          <StatsCard
            icon={icons.resolved}
            label={translate('resolved')}
            value={userOccurrenceDetails.resolvedOccurrences}
            filter="resolved"
            delay={900}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
