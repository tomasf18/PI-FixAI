import React, { useState } from "react";
import InfoCard from "../InfoCard/InfoCard";
import { useLanguage } from "../../../contexts/LanguageContext";

type CardData = {
  title: string;
  description: string;
  color1: string;
  color2: string;
  number: number;
};

type InfoCardGridProps = {
  cards: CardData[];
  handleCategoryChange: (category: string) => void;
  selectedCard: string | null;
  setSelectedCard: (card: string) => void;
};

const defaultColor1 = "#888888";
const defaultColor2 = "#F1F1F1";

const InfoCardGrid: React.FC<InfoCardGridProps> = ({ cards, handleCategoryChange, selectedCard, setSelectedCard }) => {
  const { traduction } = useLanguage(); 

  const handleCardClick = (title: string) => {
    setSelectedCard(title === selectedCard ? "" : title);
    handleCategoryChange(title === selectedCard ? "" : title);
  };

  return (
    <div className="flex flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
      {cards.map((card) => (
        <div className="w-5/6 mb-4" key={card.title}>
          <InfoCard
            title={traduction(card.title)}
            description={traduction(card.description)}
            color1={card.color1}
            color2={card.color2}
            number={card.number}
            selected={selectedCard === "" || selectedCard === card.title}
            defaultColor1={defaultColor1}
            defaultColor2={defaultColor2}
            onClick={() => handleCardClick(card.title)}
          />
        </div>
      ))}
    </div>
  );
};

export default InfoCardGrid;
