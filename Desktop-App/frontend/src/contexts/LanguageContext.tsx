import { createContext, useContext, useState, ReactNode } from "react";
import en from "../locales/en.json";
import pt from "../locales/pt.json";

// Define the type of the languages supported
type Language = "en" | "pt";

type Translations = {
  [key: string]: { [key: string]: string };
};

const translations: Translations = { en, pt };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  traduction: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initial state of the language is the one stored in the local storage or "pt" if it doesn't exist
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("language") as Language) || "pt"
  );

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  // Function to get the translation of a key 
  const traduction = (key: string) => {
    return translations[language]?.[key] ?? key;
  };
  

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, traduction }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
