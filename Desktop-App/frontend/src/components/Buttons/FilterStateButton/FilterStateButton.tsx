import React from "react";

interface FilterStateButtonProps {
  text?: string;
  active?: boolean;
  activeBgColor?: string;
  activeTextColor?: string;
  inactiveBgColor?: string;
  inactiveTextColor?: string;
  onClick?: () => void;
}

const FilterStateButton: React.FC<FilterStateButtonProps> = ({
  text,
  active = false,
  onClick,
  activeBgColor,
  activeTextColor,
  inactiveBgColor,
  inactiveTextColor,
}) => {
  const baseContainerClasses =
    "px-3 py-2 rounded-xl border justify-center items-center gap-2.5 inline-flex cursor-pointer";
  const containerClasses = active
    ? `${baseContainerClasses} ${
        activeBgColor || "border-blue-800 bg-blue-800 hover:bg-blue-700"
      }`
    : `${baseContainerClasses} ${
        inactiveBgColor || "border-blue-800 bg-gray-100 hover:bg-gray-200"
      }`;

  const baseTextClasses = "text-base font-medium leading-tight";
  const textClasses = active
    ? `${baseTextClasses} ${activeTextColor || "text-white"}`
    : `${baseTextClasses} ${inactiveTextColor || "text-blue-800"}`;

  return (
    <div className={containerClasses} onClick={onClick}>
      <div className={textClasses}>{text}</div>
    </div>
  );
};

export default FilterStateButton;
