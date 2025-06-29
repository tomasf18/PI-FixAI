import React, { useEffect, useState } from 'react';
import { getPhoto } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

interface ImageFromPhotoIDProps {
  photo_id: string;
  type: string;
}

const ImageFromPhotoID: React.FC<ImageFromPhotoIDProps> = ({ photo_id, type }) => {
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
    getPhoto(axiosInstance, photo_id, setImageUrl);
  }, [photo_id]);

  useEffect(() => {
    console.log('Image URL:', imageUrl);
  }, [, imageUrl]);

  return (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt="Fetched" className="w-full h-full"/>
      ) : (
        <div className="w-full h-full bg-gray-200" />
      )}
    </>
  );
};

export default ImageFromPhotoID;
