import { useLanguage } from "../../context/LanguageContext";
import AgentHeaderPart from "../../testingCode/AgentHeaderPart/AgentHeaderPart";
import AgentList from "../../testingCode/AgentList";
import FabController from "../fab/FabController";
const Agent = () => {
  const { FloatingActionButton } = useLanguage();
  const isMobile = window.innerWidth <= 768; // or use a better mobile detection if available
  return (
    <div className="">
      <div className="bg-[#FFFFFF]">
        <AgentHeaderPart />
      </div>
      <div className="min-h-screen bg-gray-100 pb-[100px] sm:py-4 md:pb-[50px]">
        <AgentList />
        {isMobile && !FloatingActionButton && <FabController />}
      </div>
    </div>
  );
};

export default Agent;
