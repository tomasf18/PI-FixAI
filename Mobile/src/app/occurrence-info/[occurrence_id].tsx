import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MotiView } from 'moti';
import { router, useLocalSearchParams } from 'expo-router';

import { icons, images } from '@/constants';
import { ImageFromPhotoID, StatusStepper } from '@/components';
import { formatDateTime, getFormattedAddress } from '@/utils';
import { useTranslation, useAuth, useSetLoading } from '@/contexts';
import { getOccurrence, OccurrenceResponse, LocationCoords } from '@/api';

const OccurrenceInfo = () => {
  const { translate } = useTranslation();
  const [occurrenceDetails, setOccurrenceDetails] =
    useState<OccurrenceResponse>({} as OccurrenceResponse);
  const [formattedAddress, setFormattedAddress] = useState<string | null>('');
  const setLoading = useSetLoading();
  const { axiosInstance } = useAuth();
  const { occurrence_id } = useLocalSearchParams();

  useEffect(() => {
    if (occurrenceDetails.photo_latitude && occurrenceDetails.photo_longitude) {
      const locationCoords: LocationCoords = {
        photo_latitude: occurrenceDetails.photo_latitude,
        photo_longitude: occurrenceDetails.photo_longitude,
      };
      getFormattedAddress(locationCoords).then(setFormattedAddress);
    }
  }, [occurrenceDetails]);

  const formattedDate = formatDateTime(occurrenceDetails.date);

  useEffect(() => {
    setLoading(true);

    getOccurrence(axiosInstance, occurrence_id as string)
      .then((response) => {
        setOccurrenceDetails(response);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log('Unauthorized');
          router.replace('/sign-in');
        }
        console.log('Error fetching occurrence:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="border-b border-b-gray-100 flex-row justify-between items-center px-7">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.back}
            resizeMode="contain"
            className="w-[30px] h-[54px]"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Image
            source={images.logo}
            className="w-[100px] h-[54px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View className="w-[30px] h-[54px]"></View>
      </View>
      <ScrollView>
        <View className="w-full min-h-full px-4 mt-4">
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            className="w-full h-80"
          >
            <ImageFromPhotoID
              photo_id={occurrenceDetails.photo_id}
              type="medium"
              className="rounded-2xl"
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 100 }}
            className="py-4 min-h-24 justify-center"
          >
            <Text className="text-3xl font-semibold">
              {translate(occurrenceDetails.category)}
            </Text>
          </MotiView>

          {/* submitted + location + status */}
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            className="border-t border-gray-200 py-4 justify-center gap-y-8"
          >
            {/* Submitted */}
            <View className="flex-row items-center">
              <View className="flex-row items-center flex-1">
                <Image
                  source={icons.calendar}
                  resizeMode="contain"
                  className="w-8 h-8"
                />
                <Text className="text-xl font-semibold ml-3">
                  {translate('submitted')}:
                </Text>
              </View>
              <Text className="text-gray-600 text-lg">{formattedDate}</Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center">
              <View className="flex-row items-center flex-1">
                <Image
                  source={icons.location}
                  resizeMode="contain"
                  className="w-8 h-8"
                />
                <Text className="text-xl font-semibold ml-3">
                  {translate('location')}:
                </Text>
              </View>
              <Text className="text-gray-600 text-lg text-right">
                {formattedAddress}
              </Text>
            </View>

            {/* Status */}
            <View className="flex-row items-center">
              <View className="flex-row items-center flex-1">
                <Image
                  source={icons.time}
                  resizeMode="contain"
                  className="w-8 h-8"
                />
                <Text className="text-xl font-semibold ml-3">
                  {translate('status')}:
                </Text>
              </View>
              <StatusStepper currentStatus={occurrenceDetails.status} />
            </View>
          </MotiView>

          {/* Description */}
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 500 }}
            className="border-t border-gray-200 py-4 min-h-24 justify-center"
          >
            <View className="flex-row items-center mb-2">
              <Image
                source={icons.edit_blue}
                resizeMode="contain"
                className="w-8 h-8"
              />
              <Text className="text-xl font-semibold ml-3">
                {translate('description')}
              </Text>
            </View>
            <Text className="text-gray-600 text-lg">
              {occurrenceDetails.description}
            </Text>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OccurrenceInfo;
