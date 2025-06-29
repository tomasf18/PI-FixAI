import React from "react";

interface SeverityLabelProps {
  text: string;
  textColor: string;
  bgColor: string;
}

const SeverityLabel: React.FC<SeverityLabelProps> = ({
  text,
  textColor,
  bgColor,
}) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium`}
      style={{
        color: textColor,
        backgroundColor: bgColor,
      }
    }
    >
      {text}
    </span>
  );
};

export default SeverityLabel;
