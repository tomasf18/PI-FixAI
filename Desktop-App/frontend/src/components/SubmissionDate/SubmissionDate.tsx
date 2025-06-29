import React from "react";

type SubmissionDateProps = {
  date: string;
};

const SubmissionDate: React.FC<SubmissionDateProps> = ({ date }) => {
  const formattedDate = date.replace("T", " ").slice(0, 16);
  return <div className="w-full text-black text-sm font-semibold">{formattedDate}</div>;
};


export default SubmissionDate;
