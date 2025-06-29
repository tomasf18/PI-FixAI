# How to use InfoCardGrid component

´´´tsx
import React from "react";
import InfoCardGrid from "./components/InfoCardGrid/InfoCardGrid";

const cardDataList = [
  { title: "Semáforos", description: "Falhas ou configurações incorretas.", color1: "#c63232", color2: "#f9cbc4", number: 8 },
  { title: "Drenagem Urbana", description: "Acúmulo de água nas vias ou falhas no escoamento.", color1: "#B12853", color2: "#F3DEE5", number: 5 },
  { title: "Pavimento", description: "Buracos e superfícies irregulares.", color1: "#283FB1", color2: "#F6F4FF", number: 13 },
  { title: "Sinais de Trânsito", description: "Sinais ausentes, danificados ou obstruídos.", color1: "#1DA049", color2: "#F2FFF3", number: 23 },
  { title: "Infraestrutura", description: "Bancos, lixeiras ou abrigos de autocarros danificados.", color1: "#D99241", color2: "#FFEBD5", number: 4 },
  { title: "Iluminação", description: "Postes apagados ou com funcionamento irregular.", color1: "#1A7FED", color2: "#F6F4FF", number: 9 },
  { title: "Outros", description: "Qualquer outro problema urbano.", color1: "#56C2D1", color2: "#EFFDFF", number: 1 }
];

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <InfoCardGrid cards={cardDataList} />
    </div>
  );
};

export default App;
´´´

