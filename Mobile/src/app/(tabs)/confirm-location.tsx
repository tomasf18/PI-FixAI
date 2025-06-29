import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { MapComponent, ReportOccurrenceModal } from '@/components';
import { useLocation, useSetLoading, useLlm, useGeneral, useTranslation } from '@/contexts';
import { usePhotoFlow } from '@/hooks';


const START_LATITUDE = 40.6335918;
const START_LONGITUDE = -8.6541024;
const LATITUDE_DELTA = 0.0030;
const LONGITUDE_DELTA = 0.0030;

const ConfirmLocation = () => {
  const { translate } = useTranslation();
  const [mapKey, setMapKey] = useState(Date.now());
  const { location, startWatching } = useLocation();
  const setLoading = useSetLoading();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [mapRegion, setMapRegion] = useState({
    latitude: location?.coords.latitude || START_LATITUDE,
    longitude: location?.coords.longitude || START_LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const handleMapPress = (coords: { latitude: number; longitude: number }) => {
    setSelectedLocation(coords);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      setModalVisible(true);
    }
  };

  // ------

  const [modalVisible, setModalVisible] = useState(false);
  const { llmResponse } = useLlm();
  const { preSubmitResponse, photoUri, setPhotoUri } = useGeneral();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      startWatching();
      if (location) {
        const initial = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setSelectedLocation(initial);
        setMapRegion({
          ...initial,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
      setMapKey(Date.now());
      setLoading(false)
    }, [])
  );

  return (
    <View className="flex-1 w-full h-full">
      <View className="top-0 left-0 right-0 h-20 bg-white z-10 justify-center items-center px-4">
        <Text className="text-lg font-bold text-gray-800">{translate('confirm_location')}</Text>
        <Text className="text-sm font-light text-gray-600 text-center">
          {translate('confirm_location_subtitle')}
        </Text>
      </View>
      <MapComponent
        mapStyle={{ flex: 1, width: '100%', height: '100%', borderRadius: 10 }}
        key={mapKey}
        startPosition={mapRegion}
        selectable={true}
        onMapPress={handleMapPress}
        markers={selectedLocation ? [{ latlng: selectedLocation }] : []}
        mapType="satellite"
      />
      <View className="flex-row justify-between p-3 bg-white">
        <TouchableOpacity
          className="flex-1 mx-2 p-4 bg-gray-200 rounded-lg items-center justify-center"
          onPress={() => {
            setPhotoUri(null);
            router.replace('/photo');
          }}
        >
          <Text className="text-gray-600 font-bold text-center">{translate('back_to_photo')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 mx-2 p-4 rounded-lg items-center justify-center ${
            selectedLocation ? 'bg-primary' : 'bg-gray-300'
          }`}
          onPress={handleConfirm}
          disabled={!selectedLocation}
        >
          <Text className="text-white font-bold text-center justify-center">{translate('confirm_location')}</Text>
        </TouchableOpacity>
      </View>
      <ReportOccurrenceModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        locationCoords={{ 
          photo_latitude: selectedLocation?.latitude ?? 0, 
          photo_longitude: selectedLocation?.longitude ?? 0 
        }}
        preSubmitResponse={preSubmitResponse}
        photoUri={photoUri}
        llm_response={llmResponse}
      />
    </View>
  );
};

export default ConfirmLocation;
