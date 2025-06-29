import React from "react";

type StatusLabelProps = {
  text: string;
  number: number;
  color1: string;
  color2: string;
};

const StatusLabel: React.FC<StatusLabelProps> = ({
  text,
  number,
  color1,
  color2,
}) => {
  return (
    <div
      className="w-full px-3 py-1.5 rounded-2xl flex justify-center items-center border-2 font-bold"
      style={{ borderColor: color1, backgroundColor: color2, color: color1 }}
    >
      <div>{`${text} ${number}`}</div>
    </div>
  );
};

export default StatusLabel;
