import { FaSearch } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

const AccountButton = ({ onClick, isActive }) => {
  const { t } = useLanguage();

  return (
    <button
      className={`flex flex-1 flex-col items-center justify-center px-1 py-2 text-xs transition-colors ${
        isActive ? "text-blue-500" : "text-primary-500 hover:text-blue-500"
      }`}
      onClick={onClick}
      aria-label="Open search page"
    >
      <FaSearch
        className={`mx-auto h-6 w-6 ${isActive ? "text-blue-500" : "text-black"}`}
      />
      <p className="text-[12px] text-[#696969]">
        {t.mbailfooter.Search || "Search"}
      </p>
    </button>
  );
};

export default AccountButton;
