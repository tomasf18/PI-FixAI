import React from "react";

type DescriptionTextProps = {
  title: string;
  description: string;
  className?: string;
};

const DescriptionText: React.FC<DescriptionTextProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <div className={`w-full text-black text-md ${className}`}>
      <span className="font-bold">{title}</span>
      <div className="mt-1 rounded-lg h-full overflow-y-auto">
        <p className="font-normal">{description}</p>
      </div>
    </div>
  );
};

export default DescriptionText;
