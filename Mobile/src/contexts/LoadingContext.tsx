import { createContext, useContext, useState, ReactNode } from 'react';

const LoadingStateContext = createContext<boolean | undefined>(undefined);
const LoadingSetterContext = createContext<((loading: boolean) => void) | undefined>(undefined);


export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingStateContext.Provider value={isLoading}>
      <LoadingSetterContext.Provider value={setIsLoading}>
        {children}
      </LoadingSetterContext.Provider>
    </LoadingStateContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingStateContext);
  if (context === undefined)
    throw new Error('useLoading must be used within a LoadingProvider');
  return context;
};

export const useSetLoading = () => {
  const context = useContext(LoadingSetterContext);
  if (context === undefined)
    throw new Error('useSetLoading must be used within a LoadingProvider');
  return context;
};
