import React from "react";

type ReferenceNumberProps = {
  code: string;
};

const ReferenceNumber: React.FC<ReferenceNumberProps> = ({ code }) => {
  return (
    <div className="w-full flex items-center gap-1 text-black text-sm">
      <span className="font-bold">Ref #</span>
      <span className="font-normal">{code}</span>
    </div>
  );
};

export default ReferenceNumber;
