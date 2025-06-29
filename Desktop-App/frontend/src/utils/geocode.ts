import axios from 'axios';

const getFormattedAddress = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'json',
        lat: latitude,
        lon: longitude,
      },
      headers: {
        'Accept-Language': 'en',
      },
    });

    const data = response.data;
    const address = data.address;

    const formattedAddress = `${address.road || ''}`; // TODO: `${address.suburb || ''}, ${address.road || address.neighbourhood || ''}`.trim();

    return formattedAddress || 'No address found';
  } catch (error) {
    console.error('Error during reverse geocoding:', error);
    return 'No address found';
  }
};

export {getFormattedAddress};
