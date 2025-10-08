import { useState } from "react";
import { FaHome, FaSearch, FaPlusCircle, FaBell, FaUser } from "react-icons/fa";

// 1. Predefined nav item objects
const navItems = [
  { id: "home", label: "Home", icon: <FaHome /> },
  { id: "search", label: "Search", icon: <FaSearch /> },
  { id: "add", label: "Add", icon: <FaPlusCircle /> },
  { id: "alerts", label: "Alerts", icon: <FaBell /> },
  { id: "profile", label: "Profile", icon: <FaUser /> },
];

const BottomNav = () => {
  const [active, setActive] = useState("home");

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
            isCenter={item.id === "add"}
          />
        ))}
      </div>
    </nav>
  );
};

// 2. NavItem Component
const NavItem = ({ icon, label, active, onClick, isCenter }) => (
  <button
    onClick={onClick}
    className={`flex cursor-pointer flex-col items-center border text-sm transition-all ${
      active ? "font-semibold text-blue-600" : "text-gray-600"
    } ${isCenter ? "scale-110" : ""}`}
  >
    <div className="text-2xl">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);

export default BottomNav;
