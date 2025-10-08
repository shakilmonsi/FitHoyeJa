import { Link } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useLanguage } from "../../context/LanguageContext";

const AgentHeaderPart = () => {
  const { isRTL, t, language } = useLanguage();
  return (
    <div className="border-1 border-t border-gray-300 bg-[#F5F7F9]">
      <div className="mx-auto w-full max-w-7xl bg-[#F5F7F9] px-5 text-center">
        <div className="flex items-center px-1 py-2 text-[12px] font-normal text-[#556885]">
          <Link to="/" className="px-1 text-[14px] font-[500] text-[#556885]">
            {t?.agent?.home || " Agents"}
          </Link>
          <>
            <MdKeyboardArrowRight className="font-bold" />
          </>
          <Link
            to="/buy-credits"
            className="px-1 text-[14px] font-[500] text-[#556885]"
          >
            {t?.agent?.join || " Agents"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentHeaderPart;
