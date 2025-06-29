import * as Location from 'expo-location';
import { LocationCoords } from '@/api/dto/dto';

const getFormattedAddress = async (
  coords: LocationCoords
): Promise<string> => {
  try {
    const address = await Location.reverseGeocodeAsync({
      latitude: coords.photo_latitude,
      longitude: coords.photo_longitude,
    });
    if (address.length > 0) {
      const locationDetails = address[0];
      const formattedAddress = `${locationDetails.subregion || ''}, ${
        locationDetails.name || ''
      }`.trim();
      return formattedAddress || "No address found";
    }
    console.log('No address found for these coordinates.');
    return "No address found";
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return "No address found";
  }
};

export { getFormattedAddress };
