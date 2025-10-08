import { useParams, useNavigate } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";
import { FaArrowLeft } from "react-icons/fa";

const dummyChats = [
  { id: "chat1", participantName: "Mr. Alam (Apartment Ad)" },
  { id: "chat2", participantName: "Rahim Khan (Car Ad)" },
  { id: "chat3", participantName: "Property Management" },
];

const PrivateChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const currentChat = dummyChats.find((chat) => chat.id === chatId);

  if (!chatId || !currentChat) {
    navigate("/chat");
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      <header className="border-primary-500 mx-auto flex flex-shrink-0 items-center border-b bg-white p-4">
        <button
          onClick={() => navigate("/chats")}
          className="mr-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="ml-2 text-base text-[600]" />
        </button>
        <h1 className="text-[14px] font-[500] text-gray-800">
          Chat with {currentChat.participantName}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto text-[14px] font-[500]">
        <ChatWindow
          chatId={chatId}
          participantName={currentChat.participantName}
        />
      </div>
    </div>
  );
};

export default PrivateChatPage;
