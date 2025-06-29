import React from 'react';
import { View } from 'react-native';

import { usePermissions, useGeneral } from '@/contexts';
import {
  PhotoPreviewScreen,
  CameraScreen,
  PermissionDeniedScreen,
} from '@/components/';
import { usePhotoFlow } from '@/hooks';

const Photo = () => {
  const { permissions } = usePermissions();
  const hasCamera = permissions.camera?.granted;
  const hasLocation = permissions.location?.granted;

  const {
    locationCoords,
    handlePictureTaken,
  } = usePhotoFlow();

  const { photoUri, setPhotoUri } = useGeneral();
  const isReady = hasCamera && hasLocation;

  return (
    <View className="flex-1 bg-white">
      {!isReady && <PermissionDeniedScreen />}
      {isReady && photoUri && (
        <PhotoPreviewScreen
          photoUri={photoUri}
          onRetake={() => {
            setPhotoUri(null);
          }}
          locationCoords={locationCoords}
        />
      )}
      {isReady && !photoUri && (
        <CameraScreen onPictureTaken={handlePictureTaken} />
      )}
    </View>
  );
};

export default Photo;
