import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';

import { icons } from '@/constants';
import { formatDate } from '@/utils/date';
import ImageFromPhotoID from './ImageFromPhotoID';

interface OccurrenceCardProps {
  color: string;
  photo_id: string;
  title: string;
  date: string;
  onPress: () => void;
}

const OccurrenceCard = ({
  color,
  photo_id,
  title,
  date,
  onPress,
}: OccurrenceCardProps) => {
  const formatedDate = formatDate(date);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className="mt-3"
    >
      <View className="flex-row items-center bg-gray-50 rounded-2xl p-2 shadow-sm">
        <View className={`w-3 h-full ${color} rounded-tl-3xl rounded-bl-3xl`} />

        <View className="w-20 h-20 ml-2">
          <ImageFromPhotoID photo_id={photo_id} type="small" />
        </View>

        <View className="flex-1 ml-4 h-full">
          <Text className="text-2xl font-semibold text-gray-800">{title}</Text>
          <Text className="text-lg text-gray-500">{formatedDate}</Text>
        </View>

          <Image
            source={icons.next_blue}
            resizeMode="contain"
            className="w-14 h-14"
          />
      </View>
    </TouchableOpacity>
  );
};

export default OccurrenceCard;