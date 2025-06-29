import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import * as Location from 'expo-location';
import { usePermissions } from './PermissionsContext';

type LocationContextType = {
  location: Location.LocationObject | null;
  error: string | null;
  startWatching: () => void;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  error: null,
  startWatching: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { permissions } = usePermissions();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const startWatching = async () => {
    try {
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000, // 5 seconds
          distanceInterval: 5, // 5 meters
        },
        (loc) => {
          setLocation(loc);
          setError(null);
        }
      );
    } catch (err) {
      console.error('Error while watching location:', err);
      setError('Erro ao obter localização.');
    }
  };

  useEffect(() => {
    if (permissions.location?.granted) {
      startWatching();
    } else {
      console.log('Permissions not granted, stopping location updates...');
      subscriptionRef.current?.remove();
      subscriptionRef.current = null;
      setLocation(null);
    }

    return () => {
      console.log('Cleaning up location watch...');
      subscriptionRef.current?.remove();
    };
  }, [permissions.location?.granted]);

  return (
    <LocationContext.Provider value={{ location, error, startWatching }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
