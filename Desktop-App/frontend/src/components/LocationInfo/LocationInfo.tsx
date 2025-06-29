import React from "react";

type LocationInfoProps = {
  location: string;
  icon: React.ReactNode;
};

const LocationInfo: React.FC<LocationInfoProps> = ({ location, icon }) => {
  return (
    <div className="w-full flex items-center gap-2 p-2">
      <div className="flex justify-center items-center">{icon}</div>
      <div className="text-black text-base font-semibold">{location}</div>
    </div>
  );
};

export default LocationInfo;
