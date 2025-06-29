import React from "react";
import { Navbar } from "flowbite-react";

interface SimpleNavbarProps {
  bgColor?: string;
  buttonElement: React.ReactNode;
  entityLogo: string;
  entityLogoAlt?: string;
}

const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  bgColor = "bg-white",
  buttonElement,
  entityLogo,
  entityLogoAlt = "Entity Logo",
}) => {
  return (
    <Navbar className={`${bgColor} shadow-md p-2`}>
      <div className="flex justify-end w-full items-center">
        {buttonElement}
        <div className="ml-7">
          <img src={entityLogo} alt={entityLogoAlt} className="h-12 w-auto" />
        </div>
      </div>
    </Navbar>
  );
};

export default SimpleNavbar;
