import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { CustomMarker } from './MapComponent';
import { useTranslation } from '@/contexts/TranslationContext';
import { icons } from '@/constants';
import { getFormattedAddress } from '@/utils/geocode';

const MyCustomCalloutView: React.FC<CustomMarker
> = ({ title, photo_id, location, latlng }) => {
  const { translate } = useTranslation();
  const [formattedAddress, setFormattedAddress] = useState<string | null>('');

  useEffect(() => {
    const locationCoords = {
      photo_latitude: latlng.latitude,
      photo_longitude: latlng.longitude,
    };
    console.log("Location: ", location);
    // getFormattedAddress(locationCoords).then(setFormattedAddress);
  }, [latlng]);

  return (
    <View className="w-[175px] p-2">
      <View className="flex-row justify-between">
        <View className="flex-col">
          <Text className="text-[16px] w-[155px] font-bold">
            {translate(title)}
          </Text>
          <Text className="text-[14px] w-[155px]">
            {translate("click_for_details")}
          </Text>
        </View>
        <View className="justify-center items-center">
          <Image
            source={icons.next}
            resizeMode="contain"
            className="w-[40px] h-[35px] pr-[20px]"
          />
        </View>
      </View>
    </View>
  );
};

export default MyCustomCalloutView;
