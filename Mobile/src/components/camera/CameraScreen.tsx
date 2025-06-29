import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Text,
  Pressable,
} from 'react-native';
import { CameraView, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { LocationCoords } from '@/api';
import { useLocation, useGeneral, useTranslation } from '@/contexts';

type CameraScreenProps = {
  onPictureTaken: (uri: string, coords: LocationCoords) => void;
};

const CameraScreen = ({ onPictureTaken }: CameraScreenProps) => {
  const { translate } = useTranslation();
  const { location } = useLocation();
  const { setPhotoUri } = useGeneral();
  const cameraRef = useRef<CameraView>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const getCoords = async (): Promise<LocationCoords> => {
    if (location) {
      return {
        photo_latitude: location.coords.latitude,
        photo_longitude: location.coords.longitude,
      };
    } else {
      const fallback = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return {
        photo_latitude: fallback.coords.latitude,
        photo_longitude: fallback.coords.longitude,
      };
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        const coords = await getCoords();
        setPhotoUri(photo.uri);
        onPictureTaken(photo.uri, coords);
      }
    }
  };

  const handlePickFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access photo library is needed!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const handleConfirmImage = async () => {
    if (selectedImage) {
      const coords = await getCoords();
      setPhotoUri(selectedImage);
      onPictureTaken(selectedImage, coords);
      setModalVisible(false);
    }
  };

  return (
    <View className="flex-1 justify-center">
      <CameraView
        style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}
        facing="back"
        flash={flash}
        zoom={0.12}
        ref={cameraRef}
      >
        {/* Flash toggle */}
        <TouchableOpacity className="absolute ml-6 mt-6" onPress={toggleFlash}>
          <Ionicons
            name={flash === 'off' ? 'flash-off' : 'flash'}
            size={30}
            color="white"
          />
        </TouchableOpacity>

        {/* Bottom controls */}
        <View className="absolute bottom-8 w-full flex-row items-center px-8">
          {/* Pick from gallery - left */}
          <TouchableOpacity
            className="bg-white/30 rounded-full w-16 h-16 flex items-center justify-center"
            onPress={handlePickFromGallery}
          >
            <Ionicons name="image-outline" size={30} color="white" />
          </TouchableOpacity>

          {/* Spacer to push camera to center */}
          <View className="flex-1 items-center">
            {/* Take photo - center */}
            <TouchableOpacity
              className="bg-white/30 rounded-full w-20 h-20 flex items-center justify-center"
              onPress={handleTakePicture}
            >
              <Ionicons name="camera" size={40} color="white" />
            </TouchableOpacity>
          </View>

          {/* Optional right placeholder to balance layout */}
          <View className="w-16 h-16" />
        </View>

      </CameraView>

      {/* Image confirm modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70 px-6">
          <View className="bg-white rounded-2xl p-4 items-center w-full">
            <Text className="text-xl font-semibold mb-4">{translate('use_photo_question')}</Text>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 250, height: 250, borderRadius: 12 }}
                resizeMode="cover"
              />
            )}
            <View className="flex-row mt-6 gap-4">
              <Pressable
                className="bg-primary px-4 py-2 rounded-xl"
                onPress={handleConfirmImage}
              >
                <Text className="text-white font-medium">{translate('camera_use_photo')}</Text>
              </Pressable>
              <Pressable
                className="bg-gray-400 px-4 py-2 rounded-xl"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white font-medium">{translate('cancel')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CameraScreen;
