import React from "react";

interface ReportFastProps {
  icon: React.ReactNode;
  mainText: string;
  subText: string;
}

const ReportFastComponent: React.FC<ReportFastProps> = ({ icon, mainText, subText }) => {
  return (
    <div className="w-72 h-28 p-6 bg-white rounded-lg shadow-lg flex items-center gap-3 overflow-hidden">
      {/* Ícone */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Texto */}
      <div className="flex flex-col justify-center">
        <div className="text-gray-800 text-2xl font-bold leading-loose">{mainText}</div>
        <div className="text-gray-600 text-lg font-normal leading-7">{subText}</div>
      </div>
    </div>
  );
};

export default ReportFastComponent;
