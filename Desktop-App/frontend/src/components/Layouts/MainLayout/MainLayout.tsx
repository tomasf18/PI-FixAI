import React from "react";
import { LuMapPin } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { VerticalNavbar, NavItemConfig } from "../../";
import { useLanguage } from "../../../contexts/LanguageContext";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { traduction } = useLanguage();

  const navItems: NavItemConfig[] = [
    { id: "inicio", label: traduction("home"), icon: <GoHomeFill size={22} />, onClick: () => navigate("/service/home"), route: "/service/home" },
    { id: "mapa", label: traduction("map"), icon: <LuMapPin size={22} />, onClick: () => navigate("/service/incidents-map"), route: "/service/incidents-map" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-grow">
        <div className="sticky top-0 h-screen">
          <VerticalNavbar items={navItems} />
        </div>

        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
