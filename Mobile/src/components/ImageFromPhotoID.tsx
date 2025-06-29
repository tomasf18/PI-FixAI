import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { getPhoto } from '@/api/api-consumer';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface ImageFromPhotoIDProps {
  photo_id: string;
  type: string;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';
  className?: string;
}

const ImageFromPhotoID: React.FC<ImageFromPhotoIDProps> = ({
  photo_id,
  type,
  resizeMode = 'cover',
  className,
}) => {
	const { axiosInstance } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  if (type !== 'medium' && type !== 'small') {
    throw new Error('Invalid type: type must be either "medium" or "small"');
  }

  useEffect(() => {
    if (!photo_id) {
      setImageUrl(null);
      return;
    }
		// TODO: add a different endpoint for small and medium images
    getPhoto(axiosInstance, photo_id, setImageUrl)
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log('Unauthorized');
          router.replace('/sign-in');
        } else {
          console.error('Error fetching photo:', error);
        }
      });
  }, [photo_id]);

  return (
    <>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} className={`w-full h-full ${className}`} resizeMode={resizeMode} />
      ) : (
        <View className={`w-full h-full bg-gray-200 ${className}`} />
      )}
    </>
  );
};

export default ImageFromPhotoID;
