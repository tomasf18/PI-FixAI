//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <LanguageProvider> 
    <App />
  </LanguageProvider>
  // </StrictMode>
);
