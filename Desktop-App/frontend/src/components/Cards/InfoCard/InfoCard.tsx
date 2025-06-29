import React from "react";

type InfoCardProps = {
  title: string;
  description: string;
  color1: string;
  color2: string;
  number: number;

  selected: boolean;
  defaultColor1: string;
  defaultColor2: string;
  onClick: () => void;
};

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  color1,
  color2,
  number,
  selected,
  defaultColor1,
  defaultColor2,
  onClick,
}) => {
  return (
    <div
      className="grid grid-cols-1 border border-zinc-500 rounded-lg overflow-hidden cursor-pointer"
      style={{ backgroundColor: selected ? color2 : defaultColor2 }}
      onClick={onClick}
    >
      <div
        className={`p-2 font-semibold text-white text-md tracking-tight text-center`}
        style={{ backgroundColor: selected ? color1 : defaultColor1 }}
      >
        {title}
      </div>
      <div className={`p-4 flex justify-between`}>
        <div className="w-3/4 text-xs font-semibold text-black px-4">
          {description}
        </div>
        <div className="w-1/4 text-4xl font-semibold text-black text-center">
          {number}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
