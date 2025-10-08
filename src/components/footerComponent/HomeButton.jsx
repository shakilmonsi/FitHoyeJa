// HomeButton.jsx

import { RiHome6Fill } from "react-icons/ri";
import { useLanguage } from "../../context/LanguageContext";

const HomeButton = ({ isActive, onClick }) => {
  const { t, isRTL } = useLanguage();
  return (
    <button
      className={`relative flex flex-1 flex-col items-center justify-center px-1 py-2 text-xs font-medium transition-colors duration-300 ${isActive ? "text--primary-500" : "text-gray-500"} ${isActive ? "" : "hover:text-blue-500"} border-0 focus:ring-0 focus:outline-none`}
      onClick={onClick}
    >
      {/* Active line (top) - narrower width */}
      {isActive && (
        <div
          className="absolute top-0 left-1/2 h-1 w-4/5 -translate-x-1/2 transform rounded-b-lg"
          style={{ backgroundColor: "#1EAEED" }}
        ></div>
      )}

      {/* Home icon */}
      <RiHome6Fill
        className={`h-6 w-6 ${isActive ? "text-black" : "text-black"} transition-colors duration-300`}
      />

      {/* Home text */}
      <p className="text-[12px] text-[#696969]">{t?.mbailfooter?.home}</p>
    </button>
  );
};

export default HomeButton;
