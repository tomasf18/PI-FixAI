# How to use CustomCard component

´´´tsx
import React from "react";
import CustomCard from "./components/CustomCard/CustomCard";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <CustomCard 
        icon={
          <svg viewBox="0 0 24 24" strokeWidth={2} stroke="#283FB1" className="w-6 h-6" fill="#283FB1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
          </svg>
        } 
        text="Painel de Controlo" 
        borderColor="#283FB1" 
      />
    </div>
  );
};

export default App;
´´´
