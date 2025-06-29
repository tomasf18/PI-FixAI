## How to use the Vertical NavBar

```tsx
import VerticalNavbar, {NavItemConfig} from "./components/NavBars/VerticalNavbar/VerticalNavbar"
import { LuMapPin } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";

export default function App() {
  const navItems: NavItemConfig[] = [
    { id: 'inicio', label: 'Início', icon: <GoHomeFill size={22}/>}, // the default colors will be blue for active and gray for inactive
    { id: 'mapa', label: 'Mapa', icon: <LuMapPin size={22}/>         // but you can customize it!!
        activeColor: "bg-red-800 text-white enabled:hover:bg-red-700", 
        inactiveColor: "bg-green-100 text-black enabled:hover:bg-green-200"},      
  ];

  return (
    <>
      <VerticalNavbar items={navItems}/>
    </>
  )
}
```