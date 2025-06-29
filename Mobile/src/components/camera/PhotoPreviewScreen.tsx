import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, Alert } from 'react-native';
import ReportOccurrenceModal from '@/components/ReportOccurrenceModal';
import { useTranslation, useSetLoading } from '@/contexts';
import { LocationCoords, PreSubmitOccurrenceResponse } from '@/api/dto/dto';
import { useOccurrenceSubmission } from '@/hooks';

type PhotoPreviewScreenProps = {
  photoUri: string | null;
  onRetake: () => void;
  locationCoords: LocationCoords | null;
};

const PhotoPreviewScreen = ({
  photoUri,
  onRetake,
  locationCoords,
}: PhotoPreviewScreenProps) => {
  const { translate } = useTranslation();

  const { submit } = useOccurrenceSubmission({
    photoUri,
    locationCoords,
  });

  return (
    <View className="flex-1 relative">
      <Image
        source={{ uri: photoUri || '' }}
        className="w-full h-full object-cover rounded-xl"
      />
      <View className="absolute bottom-10 left-5">
        <TouchableOpacity
          onPress={onRetake}
          className="bg-black/50 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-lg">
            {translate('camera_retake_photo')}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-10 right-5">
        <TouchableOpacity
          onPress={submit}
          className="bg-black/50 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-lg">
            {translate('camera_use_photo')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PhotoPreviewScreen;
