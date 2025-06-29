import React from "react";

type CustomCardProps = {
  icon: React.ReactNode;
  text: string;
  borderColor: string;
};

const CustomCard: React.FC<CustomCardProps> = ({ icon, text, borderColor }) => {
  return (
    <div
      className="w-full flex justify-center items-center gap-2 p-4 bg-white rounded-lg border-t-4 shadow-lg backdrop-blur-md overflow-hidden"
      style={{ borderTopColor: borderColor }}
    >
      <div className="flex justify-center items-center">{icon}</div>
      <div className="text-black text-base font-normal">{text}</div>
    </div>
  );
};

export default CustomCard;
