import { AppState } from 'react-native';
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

type PermissionStatus = {
  granted: boolean;
  canAskAgain: boolean;
};

type PermissionState = {
  camera: PermissionStatus | null;
  location: PermissionStatus | null;
};

type PermissionsContextType = {
  permissions: PermissionState;
  requestPermissions: () => Promise<void>;
  checkPermissions: () => Promise<void>;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const PermissionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [permissions, setPermissions] = useState<PermissionState>({
    camera: null,
    location: null,
  });

  const checkPermissions = async () => {
    const location = await Location.getForegroundPermissionsAsync();
    const camera = await Camera.getCameraPermissionsAsync();
    setPermissions({ location, camera });
  };

  const requestPermissions = async () => {
    const location = await Location.requestForegroundPermissionsAsync();
    const camera = await Camera.requestCameraPermissionsAsync();
    setPermissions({ location, camera });
  };

  useEffect(() => {
    console.log('Checking permissions on mount');
    checkPermissions();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        console.log('App is active, checking permissions again');
        checkPermissions(); // check again when user returns to app
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{ permissions, requestPermissions, checkPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionsContext);
  if (!ctx)
    throw new Error('usePermissions must be used within PermissionsProvider');
  return ctx;
};
