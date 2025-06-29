import React, { createContext, useState, useContext } from 'react';
import { PreSubmitOccurrenceResponse } from '@/api';

type GeneralContextType = {
  preSubmitResponse: PreSubmitOccurrenceResponse | null;
  setPreSubmitResponse: (response: PreSubmitOccurrenceResponse | null) => void;
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preSubmitResponse, setPreSubmitResponse] = useState<PreSubmitOccurrenceResponse | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <GeneralContext.Provider
      value={{
        preSubmitResponse,
        photoUri,
        setPreSubmitResponse,
        setPhotoUri,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = (): GeneralContextType => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error('useGeneral must be used within a GeneralProvider');
  }
  return context;
};