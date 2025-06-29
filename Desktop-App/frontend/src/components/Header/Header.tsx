import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { Button, LanguageSelect } from "../../components";
import customHeaderTheme from "./CustomHeaderTheme";
import { Logo } from "../../assets";

interface HeaderProps {
  links?: { href: string; label: string }[];
  buttons?: { to: string; label: string; color: "primary" | "secondary"; className?: string; onClick?: () => void }[];
}

export default function Header({ links = [], buttons = [] }: HeaderProps) {
  return (
    <Navbar fluid rounded theme={customHeaderTheme}>
      <Navbar.Brand>
        <img src={Logo} className="mr-3 h-12" alt="Our Super App" />
        {/* <span className="self-center whitespace-nowrap text-2xl font-bold dark:text-white">
          Our Super App
        </span> */}
      </Navbar.Brand>

      {/* Buttons */}
      
      <div className="flex md:order-2 space-x-2 items-center">
        <LanguageSelect />
  
        {buttons.map((button, index) => (
          <Link to={button.to} key={index} onClick={button.onClick}>
            <Button color={button.color} className={button.className}>{button.label}</Button>
          </Link>
        ))}
        <Navbar.Toggle />
      </div>

      {/* Links */}
      <Navbar.Collapse>
        {links.map((link, index) => (
          <Navbar.Link href={link.href} key={index} className="text-lg">
            {link.label}
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
