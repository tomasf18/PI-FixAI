import { useState } from 'react';
import { LocationCoords,  } from '@/api';

export function usePhotoFlow() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<LocationCoords | null>(
    null
  );

  const handlePictureTaken = (uri: string, coords: LocationCoords) => {
    setPhotoUri(uri);
    setLocationCoords(coords);
  };

  const resetPhoto = () => {
    setPhotoUri(null);
    setLocationCoords(null);
  };

  return {
    photoUri,
    locationCoords,
    setPhotoUri,
    handlePictureTaken,
    handleRetake: resetPhoto,
    handleCloseModal: resetPhoto,
  };
}
