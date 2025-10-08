import React from "react";
import { PiBagFill } from "react-icons/pi";
import { useLanguage } from "../../context/LanguageContext";

const CommercialButton = ({ isActive, onClick }) => {
  const { t, isRTL } = useLanguage();

  return (
    <button
      className={`relative flex flex-1 flex-col items-center justify-center px-1 py-2 text-xs font-medium transition-colors duration-300 ${isActive ? "text-[#0A3459]" : "text-gray-500"} ${isActive ? "" : "hover:text-blue-500"} border-0 focus:ring-0 focus:outline-none`}
      onClick={onClick}
    >
      {/* Narrower active line (60% width, centered) */}
      {isActive && (
        <div
          className="absolute top-0 left-1/2 h-[3px] w-[60%] -translate-x-1/2 transform rounded-b-lg"
          style={{ backgroundColor: "#1EAEED" }}
        ></div>
      )}

      {/* Commercial icon */}
      <PiBagFill
        className={`mb-1 h-6 w-6 ${isActive ? "text-black" : "text-black"} transition-colors duration-300`}
      />

      <p className="text-[12px] text-[#696969]">{t?.mbailfooter?.offiecs}</p>
    </button>
  );
};

export default CommercialButton;
