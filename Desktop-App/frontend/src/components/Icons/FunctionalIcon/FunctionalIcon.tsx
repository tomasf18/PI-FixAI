import React from 'react';

interface FunctionalIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

const FuncIcon: React.FC<FunctionalIconProps> = ({ icon, onClick }) => {
    return (
        <div className="cursor-pointer" onClick={onClick}>
        {icon}
        </div>
    );
} 

export default FuncIcon;