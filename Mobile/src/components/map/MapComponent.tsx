import React, { useState } from 'react';
import MapView, { Marker, Callout, MapViewProps, MapPressEvent } from 'react-native-maps';
import { ViewStyle, Text } from 'react-native';
import CustomMarkerView from './CustomMarkerView';
import CustomCalloutView from './CustomCalloutView';
import { getFormattedAddress } from '@/utils';

interface CustomMarker {
  latlng: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  location?: string;
  photo_id?: string;
  callable?: () => void;
}

interface MapComponentProps extends MapViewProps {
  markers?: CustomMarker[];
  startPosition: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  selectable?: boolean; // Enable marker placement
  onMapPress?: (coords: { latitude: number; longitude: number }) => void; // Handle map press
  mapStyle?: ViewStyle; // Optional map style
}

const MapComponent: React.FC<MapComponentProps> = ({
  markers = [],
  startPosition,
  selectable = false,
  onMapPress,
  mapStyle,
  mapType = 'standard', 
}) => {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [newAddress, setNewAddress] = useState<Record<string, string>>({});

  const handleMarkerPress = async (marker: CustomMarker) => {
    console.log('Marker pressed:', marker);
    const markerId = marker.photo_id || ''; // Use photo_id if available
    setSelectedMarkerId(markerId);

    if (!addresses[markerId] && marker.latlng) {
      const location = {
        photo_latitude: marker.latlng.latitude,
        photo_longitude: marker.latlng.longitude,
      };
      const addr = await getFormattedAddress(location);
      setAddresses((prev) => ({ ...prev, [markerId]: addr }));
    }

    if (marker.callable) marker.callable();
  };

  const handleMapPress = (event: MapPressEvent) => {
    if (selectable && onMapPress) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      onMapPress({ latitude, longitude });
    }
  };

  return (
    <MapView
      style={[mapStyle]} // Combine default and custom styles
      initialRegion={{
        latitude: startPosition.latitude,
        longitude: startPosition.longitude,
        latitudeDelta: startPosition.latitudeDelta,
        longitudeDelta: startPosition.longitudeDelta,
      }}
      mapType={mapType}
      onPress={handleMapPress} // Handle map press for marker placement
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.latlng}
          draggable={selectable}
          onDragEnd={(e) => {
            if (selectable && onMapPress) {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              onMapPress({ latitude, longitude });
            }
          }}
        >
          {marker.photo_id ? (
            <CustomMarkerView {...marker} />
          ) : (
           <></> // Render a simple marker if no photo_id is provided
          )}
          {marker.title && (
            <Callout onPress={() => handleMarkerPress(marker)}>
              <CustomCalloutView
                {...marker}
              />
            </Callout>
          )}
        </Marker>
      ))}
    </MapView>
  );
};

export default MapComponent;
export { CustomMarker };