import React from 'react';
import { Button } from 'flowbite-react';

interface NavItemProps {
  label?: string;
  icon?: React.ReactNode; 
  activeColor?: string;
  inactiveColor?: string;
  active?: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavItemProps> = ({ label, icon, activeColor, inactiveColor, active = false, onClick }) => {
  const color = active
    ? activeColor || "bg-blue-800 text-white enabled:hover:bg-blue-700 focus:outline-none focus:ring-0" 
    : inactiveColor || "bg-gray-100 text-black enabled:hover:bg-gray-200 focus:outline-none focus:ring-0";
    
  return (
    <Button size='lg' className={color} onClick={onClick}>
      {icon}
      {label && <div className="ml-3">{label}</div>}
    </Button>  
  );
};

export default NavButton;