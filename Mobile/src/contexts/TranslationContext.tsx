import React, { ReactNode, createContext, useState, useEffect, useContext } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing the selected language in cache

// translation files
import en from '../assets/locales/en.json';
import pt from '../assets/locales/pt.json';
import zh from '../assets/locales/zh.json';

// define the context
const TranslationContext = createContext({
  translate: (key: string) => key,
  changeLanguage: (newLanguage: string) => {},
  currentLanguage: 'en', // default fallback language
});

// define the type for the resources
type ResourcesType = {
  [key: string]: { [key: string]: string };
};

// Language resources
const resources: ResourcesType = {
  pt,
  en,
  zh,
};

// get the device's language using JavaScript
const deviceLanguage = (
  navigator.language || Intl.DateTimeFormat().resolvedOptions().locale
).split('-')[0];

const defaultLanguage = resources[deviceLanguage] ? deviceLanguage : 'en';

// AsyncStorage key
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

// create a provider for the context
export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  // load stored language on mount
  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && resources[storedLanguage]) {
        setLanguage(storedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const translate = (key: string) => {
    return resources[language][key] || key; // fallback to key if translation doesn't exist (translate('inexistentKey') ===> 'inexistentKey')
  };

  const changeLanguage = async (newLanguage: string) => {
    if (resources[newLanguage]) {
      setLanguage(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    }
  };

  return (
    <TranslationContext.Provider value={{ translate, changeLanguage, currentLanguage: language }}>
      {children}
    </TranslationContext.Provider>
  );
};

// hook to use translation context
export const useTranslation = () => {
  return useContext(TranslationContext);
};
