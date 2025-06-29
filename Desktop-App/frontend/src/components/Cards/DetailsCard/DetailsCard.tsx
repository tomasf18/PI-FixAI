import React from "react";
import { useLanguage } from "../../../contexts/LanguageContext";

type DetailsCardProps = {
  category: string;
  severity: string;
  occurrences: number;
  status: string;
  icon: React.ReactNode;
  borderColor: string;
};

const DetailsCard: React.FC<DetailsCardProps> = ({
  category,
  severity,
  occurrences,
  status,
  icon,
  borderColor,
}) => {

  const { traduction } = useLanguage(); // get the traduction function from the context

  return (
    <div
      className="w-full grid grid-cols-[auto_1fr] items-center gap-4 p-4 bg-white rounded-lg border-t-4 shadow-lg backdrop-blur-md overflow-hidden"
      style={{ borderTopColor: borderColor }}
    >
      <div className="flex justify-center items-center absolute top-2 right-2">
        {icon}
      </div>
      <div className="text-black text-base font-normal">
        <p>
          <span className="font-bold">{traduction("category")}:</span> {category}
        </p>
        <p>
          <span className="font-bold">{traduction("severity")}:</span> {severity}
        </p>
        <p>
          <span className="font-bold">{traduction("occurrences")}:</span> {occurrences}
        </p>
        <p>
          <span className="font-bold">{traduction("status")}:</span> {status}
        </p>
      </div>
    </div>
  );
};

export default DetailsCard;
