import React from 'react';
import { View } from 'react-native';
import { CustomMarker } from './MapComponent';
import ImageFromPhotoID from '../ImageFromPhotoID';

const CustomCalloutView: React.FC<CustomMarker> = ({ photo_id }) => {
  return (
    <View className="w-[50px] h-[50px] border-2 border-white flex items-center justify-center rounded-lg overflow-hidden">
      <ImageFromPhotoID 
      photo_id={photo_id || ''}
      type="small"
      resizeMode="cover"
      />
    </View>
  );
};

export default CustomCalloutView;