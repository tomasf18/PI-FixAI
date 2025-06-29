import React from "react";

interface ButtonProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const SimpleButton: React.FC<ButtonProps> = ({
  text,
  bgColor,
  textColor,
  onClick,
}) => {
  const buttonColor =
    bgColor || "border boder-blue-800 bg-blue-800 hover:bg-blue-700";

  return (
    <div className="inline-flex overflow-hidden" onClick={onClick}>
      <div
        className={`px-5 py-3 rounded-xl justify-center items-center gap-2.5 cursor-pointer ${buttonColor}`}
      >
        <div
          className={`text-base font-medium leading-tight ${
            textColor || "text-white"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default SimpleButton;
