import React from 'react';
import NavButton from './NavButton';
import { MdOutlineLogout } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import LanguageSelect from '../../LanguageSelect/LanguageSelect';
import { useState } from "react";
import {
  ConfirmationModal 
} from "../../../components";
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from "../../../contexts/AuthContext";

export interface NavItemConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeColor?: string;
  inactiveColor?: string;
  route?: string;
  onClick?: () => void;
}

interface NavbarProps {
  items: NavItemConfig[];
  backgroundColor?: string;
}

const VerticalNavbar: React.FC<NavbarProps> = ({ items, backgroundColor }) => {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { traduction } = useLanguage();
  const { logout } = useAuth();
  
  const defaultBackgroundColor = 'bg-gray-50';
  const color = backgroundColor || defaultBackgroundColor;

  return (
      <div className={`h-screen ${color} p-2 flex flex-col py-4`}>
        <div className='flex flex-col gap-2 flex-grow py-2'>
          {items.map(item => (
            <NavButton
              key={item.id}
              label={item.label}
              icon={item.icon}
              activeColor={item.activeColor}
              inactiveColor={item.inactiveColor}
              active={item.route === location.pathname}
              onClick={item.onClick}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 ">
          <LanguageSelect />

          <NavButton
            active={true}
            icon={<MdOutlineLogout size={22} />}
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div>
      
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          message={traduction("log_out_warning")}
          onConfirm={() => {
            setIsLogoutModalOpen(false);
            logout();
          }}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      </div>
  );
};

export default VerticalNavbar;