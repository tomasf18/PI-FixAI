import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { MapComponent } from '@/components';
import { useAuth, useSetLoading, useLocation } from '@/contexts';
import {
  getNotResolvedOccurrences,
  NotResolvedOccurrencesResponse,
} from '@/api';

const START_LATITUDE = 40.6335918;
const START_LONGITUDE = -8.6541024;
const LATITUDE_DELTA = 0.02022;
const LONGITUDE_DELTA = 0.00221;

const Map = () => {
  const { axiosInstance } = useAuth();
  const setLoading = useSetLoading();
  const { location } = useLocation();

  const [occurrences, setOccurrences] = useState<
    NotResolvedOccurrencesResponse[]
  >([]);
  const [markers, setMarkers] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getNotResolvedOccurrences(axiosInstance)
        .then((response) => {
          setOccurrences(response);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log('Unauthorized');
            router.replace('/sign-in');
          }
          console.log('Error fetching not resolved occurrences:', error);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => {
        setOccurrences([]);
        setLoading(false);
        // Cleanup function to reset state or perform any necessary cleanup
        // when the component is unmounted or the screen is blurred
      };
    }, [])
  );

  useEffect(() => {
    const loadMarkers = async () => {
      const resolvedMarkers = await Promise.all(
        occurrences.map(async (occurrence) => {
          return {
            latlng: {
              latitude: occurrence.photo_latitude,
              longitude: occurrence.photo_longitude,
            },
            title: occurrence.category,
            // later change to real image
            photo_id: occurrence.photo_id,
            callable: () =>
              router.push(`/occurrence-info/${occurrence.occurrence_id}`),
          };
        })
      );

      setMarkers(resolvedMarkers);
    };

    if (occurrences.length) {
      loadMarkers();
    }
  }, [occurrences]);

  return (
    <View className="bg-white">
      <MapComponent
        markers={markers}
        startPosition={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : {
                latitude: START_LATITUDE,
                longitude: START_LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
        }
        mapStyle={{ width: '100%', height: '100%', borderRadius: 10 }}
        pitchEnabled={false}
      />
    </View>
  );
};

export default Map;
