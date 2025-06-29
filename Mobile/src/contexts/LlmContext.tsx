import React, { createContext, useState, useContext } from 'react';

type LlmContextType = {
  llmResponse: any;
  setLlmResponse: (response: any) => void;
};

const LlmContext = createContext<LlmContextType | undefined>(undefined);

export const LlmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [llmResponse, setLlmResponse] = useState<any>(null);

  return (
    <LlmContext.Provider value={{ llmResponse, setLlmResponse }}>
      {children}
    </LlmContext.Provider>
  );
};

export const useLlm = (): LlmContextType => {
  const context = useContext(LlmContext);
  if (!context) {
    throw new Error('useLlm must be used within an LlmProvider');
  }
  return context;
};
