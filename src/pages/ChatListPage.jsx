import React, { useState, useRef, useEffect } from "react";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { IoMdArrowUp } from "react-icons/io";

import {
  FaArrowUp,
  FaMicrophone,
  FaHome,
  FaRegCommentDots,
  FaPlus,
  FaRegFolderOpen,
  FaRegUser,
  FaArrowLeft,
} from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5"; // Back arrow icon
import { useLanguage } from "../context/LanguageContext";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";

// Helper function for formatting dates for date separators
const formatDateSeparator = (isoString) => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1); // Yesterday is today - 1 day

  // Check for "Today"
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  // Check for "Yesterday"
  else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    // For dates older than yesterday: "Month Day, Year" (e.g., "July 13, 2025")
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
};

// Helper function to check if two ISO date strings fall on the same day
const isSameDay = (date1Iso, date2Iso) => {
  const date1 = new Date(date1Iso);
  const date2 = new Date(date2Iso);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Message component (updated to show sender name outside for 'other' messages)
const Message = ({ message, senderName, profilePic }) => {
  const isMyMessage = message.sender === "me";
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  };

  return (
    <div
      className={`flex ${
        isMyMessage ? "justify-end" : "justify-start"
      } mb-4 items-start`} // Added mb-4 for vertical spacing between messages
    >
      {!isMyMessage && (
        <img
          src={profilePic}
          alt={`${senderName}'s profile`}
          className="mr-2 h-8 w-8 flex-shrink-0 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/40x40/CCCCCC/000000?text=${senderName.charAt(
              0,
            )}`;
          }}
        />
      )}
      <div className="flex flex-col">
        {!isMyMessage && (
          <span className="ml-2 px-2 text-sm font-[600] text-gray-800">
            {senderName}
          </span>
        )}
        <div
          className={`flex flex-col rounded-lg p-3 shadow-md ${
            // Changed shadow to shadow-md for a slightly stronger effect
            isMyMessage
              ? "ml-2 rounded-br-none bg-blue-500 text-white" // Added ml-2 for spacing from right edge if no avatar
              : "mr-2 rounded-bl-none bg-white text-gray-800" // Added mr-2 for spacing from left edge
          } max-w-[calc(100vw-80px)] sm:max-w-[calc(100vw-120px)] md:max-w-[70%] lg:max-w-[60%]`}
        >
          <p className="text-sm break-words">{message.text}</p>
          <span
            className={`mt-1 text-right text-xs ${
              // Ensures time is right-aligned within the bubble
              isMyMessage ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
      {/* This div balances the space for 'my' messages if there's no avatar */}
      {isMyMessage && <div className="ml-2 h-8 w-8 flex-shrink-0"></div>}
    </div>
  );
};

// ChatListItem component (professionally styled)
const ChatListItem = ({ chat, onSelectChat, isSelected }) => {
  const formatLastMessageTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date >= today) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (date >= yesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center rounded-xl p-3.5 transition-colors duration-200 ease-in-out ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelectChat(chat.id, chat.participantName, chat.type)}
    >
      <img
        src={chat.profilePic}
        alt={`${chat.participantName}'s profile`}
        className="mr-3 h-12 w-12 flex-shrink-0 rounded-full object-cover shadow-sm" // Slightly larger, more shadow
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/56x56/D1D5DB/4B5563?text=${chat.participantName
            .charAt(0)
            .toUpperCase()}`; // More neutral placeholder
        }}
      />
      <div className="flex-1 overflow-hidden pr-4">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-base font-semibold text-gray-800">
            {chat.participantName}
          </h3>
          <span className="ml-2 min-w-max text-xs text-gray-500">
            {formatLastMessageTime(chat.lastMessageTimestamp)}
          </span>
        </div>
        {/* Conditionally render "ভয়েস কল" or lastMessage */}
        {chat.isVoiceCall ? (
          <p className="mt-0.5 flex items-center text-sm text-gray-600">
            <FaMicrophone className="mr-1.5 h-4 w-4 text-gray-500" /> Voice Call
          </p>
        ) : (
          <p className="mt-0.5 truncate text-sm text-gray-600">
            {chat.lastMessage}
          </p>
        )}
      </div>
    </div>
  );
};

// ChatList component (now only handles list items)
const ChatList = ({ chats, onSelectChat, selectedChatId, type }) => {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4 pt-40 pb-30">
      {chats.length === 0 ? (
        <div className="mt-4 text-center text-gray-500">
          No {type} chats found.
        </div>
      ) : (
        chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onSelectChat={onSelectChat}
            isSelected={selectedChatId === chat.id}
          />
        ))
      )}
    </div>
  );
};

// ChatWindow component (remains the same as before)

const ChatWindow = ({ chatId, participantName, chatType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Dummy messages data for different chats
  const dummyMessages = {
    chat1: [
      {
        id: 1,
        text: "Hello! Is this apartment still available?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-13T10:20:00.000Z",
      },
      {
        id: 2,
        text: "Yes, it is. Would you like to schedule a viewing?",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-13T10:25:00.000Z",
      },
      {
        id: 3,
        text: "Sure, I can show you the apartment tomorrow.",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-13T10:30:00.000Z",
      },
      {
        id: 4,
        text: "Great! What time works for you?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-13T10:35:00.000Z",
      },
      {
        id: 5,
        text: "How about 3 PM?",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-13T10:40:00.000Z",
      },
      {
        id: 6,
        text: "Okay. See you then!",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-13T10:45:00.000Z",
      },
      {
        id: 7,
        text: "Really?",
        sender: "other",
        senderName: "Shakil Monsi",
        profilePic: "https://placehold.co/40x40/33FF57/FFFFFF?text=SM",
        timestamp: "2025-07-15T11:43:00.000Z",
      },
      {
        id: 8,
        text: "Yes, brother.",
        sender: "other",
        senderName: "Shakil Monsi",
        profilePic: "https://placehold.co/40x40/33FF57/FFFFFF?text=SM",
        timestamp: "2025-07-15T11:43:30.000Z",
      },
      {
        id: 9,
        text: "I'll come one day later.",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-15T11:44:00.000Z",
      },
      {
        id: 10,
        text: "Meaning?",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-15T11:45:00.000Z",
      },
      {
        id: 11,
        text: "I'll come the day after Eid, brother.",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-15T11:45:30.000Z",
      },
      {
        id: 12,
        text: "Okay then.",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-15T11:46:00.000Z",
      },
      {
        id: 13,
        text: "I heard you're coming to the office at 9.",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-15T11:46:30.000Z",
      },
      {
        id: 14,
        text: "Hmm.",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-15T11:47:00.000Z",
      },
      {
        id: 15,
        text: "Insha'Allah.",
        sender: "other",
        senderName: "Nayem Islam",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NI",
        timestamp: "2025-07-15T11:47:30.000Z",
      },
    ],
    chat2: [
      {
        id: 1,
        text: "Can the price be lowered?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-12T09:00:00.000Z",
      },
      {
        id: 2,
        text: "It can be slightly lowered.",
        sender: "other",
        senderName: "Faruk Ahmed",
        profilePic: "https://placehold.co/40x40/33FF57/FFFFFF?text=FA",
        timestamp: "2025-07-12T09:05:00.000Z",
      },
      {
        id: 3,
        text: "It can be slightly lowered.",
        sender: "other",
        senderName: "Ahmed",
        profilePic: "https://placehold.co/40x40/33FF57/FFFFFF?text=A",
        timestamp: "2025-07-12T09:05:00.000Z",
      },
    ],
    chat3: [
      {
        id: 1,
        text: "Hey, how are you?",
        sender: "other",
        senderName: "Alif Hossain",
        profilePic: "https://placehold.co/40x40/5733FF/FFFFFF?text=AH",
        timestamp: "2025-07-14T14:30:00.000Z",
      },
      {
        id: 2,
        text: "I'm good, thanks! How about you?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-14T14:32:00.000Z",
      },
    ],
    chat4: [
      {
        id: 1,
        text: "Did you receive the documents?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-11T10:00:00.000Z",
      },
      {
        id: 2,
        text: "Yes, I did. Thanks!",
        sender: "other",
        senderName: "Taslima Begum",
        profilePic: "https://placehold.co/40x40/FF33A1/FFFFFF?text=TB",
        timestamp: "2025-07-11T10:05:00.000Z",
      },
    ],
    chat5: [
      {
        id: 1,
        text: "Could we reschedule our meeting?",
        sender: "other",
        senderName: "Rahim Khan",
        profilePic: "https://placehold.co/40x40/33A1FF/FFFFFF?text=RK",
        timestamp: "2025-07-10T16:00:00.000Z",
      },
      {
        id: 2,
        text: "Sure, when works for you?",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-10T16:05:00.000Z",
      },
    ],
    chat6: [
      {
        id: 1,
        text: "I'm coming tomorrow morning.",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-09T08:00:00.000Z",
      },
      {
        id: 2,
        text: "Okay, looking forward to it!",
        sender: "other",
        senderName: "Fahim Ahmed",
        profilePic: "https://placehold.co/40x40/A1FF33/FFFFFF?text=FA",
        timestamp: "2025-07-09T08:05:00.000Z",
      },
    ],
    chat7: [
      {
        id: 1,
        text: "Just checking in.",
        sender: "other",
        senderName: "Nusrat Jahan",
        profilePic: "https://placehold.co/40x40/FF5733/FFFFFF?text=NJ",
        timestamp: "2025-07-08T12:00:00.000Z",
      },
      {
        id: 2,
        text: "All good on my end!",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-08T12:02:00.000Z",
      },
    ],
    chat_phone_1: [
      // Added for phone number chat
      // Added for phone number chat
      // Added for phone number chat
      {
        id: 1,
        text: "Vhai electrical er gcr code ta daw to a...",
        sender: "other",
        senderName: "Munshi",
        profilePic: "https://placehold.co/40x40/CCCCCC/000000?text=PH", // Generic placeholder
        timestamp: "2025-07-10T10:00:00.000Z", // Example timestamp
      },
    ],
    chat_shaukatul_islam: [
      // Added for Shaukatul Islam chat
      {
        id: 1,
        text: "Draft: A", // Changed to English
        sender: "other",
        senderName: "Islam",
        profilePic: "https://placehold.co/40x40/D3D3D3/000000?text=SS", // Example pic
        timestamp: "2025-07-04T12:00:00.000Z", // Example timestamp
      },
    ],
    chat_urmila_fd_nub: [
      // Added for Urmila chat
      {
        id: 1,
        text: "ok",
        sender: "other",
        senderName: "Md. Milon",
        profilePic: "https://placehold.co/40x40/9400D3/FFFFFF?text=UN", // Example pic
        timestamp: "2025-07-10T14:00:00.000Z", // Example timestamp
      },
    ],
    chat_phone_2: [
      // Added for second phone number chat (voice call)
      {
        id: 1,
        text: "Voice Call", // Changed to English
        sender: "other",
        senderName: "Roky",
        profilePic: "https://placehold.co/40x40/000000/FFFFFF?text=S", // Example pic (initial S)
        timestamp: "2025-07-05T09:30:00.000Z", // Example timestamp
        isVoiceCall: true, // Indicate it's a voice call
      },
    ],
    chat_mafuj_vai: [
      {
        id: 1,
        text: "Voice Call", // Changed to English
        sender: "other",
        senderName: "roky",
        profilePic: "https://placehold.co/40x40/8B4513/FFFFFF?text=MV", // Example pic
        timestamp: "2025-07-05T10:00:00.000Z", // Example timestamp
        isVoiceCall: true, // Indicate it's a voice call
      },
    ],
    site_main_group: [
      // Dummy messages for the main site group
      {
        id: 1,
        text: "Hi team, quick reminder about the meeting at 3 PM today.",
        sender: "other",
        senderName: "Project Lead",
        profilePic: "https://placehold.co/40x40/000000/FFFFFF?text=PL",
        timestamp: "2025-07-15T10:00:00.000Z",
      },
      {
        id: 2,
        text: "Got it!",
        sender: "me",
        senderName: "You",
        timestamp: "2025-07-15T10:05:00.000Z",
      },
      {
        id: 3,
        text: "Confirmed.",
        sender: "other",
        senderName: "Member A",
        profilePic: "https://placehold.co/40x40/FF0000/FFFFFF?text=A",
        timestamp: "2025-07-15T10:06:00.000Z",
      },
      {
        id: 4,
        text: "I'll be there.",
        sender: "other",
        senderName: "Member B",
        profilePic: "https://placehold.co/40x40/00FF00/FFFFFF?text=B",
        timestamp: "2025-07-15T10:07:00.000Z",
      },
      {
        id: 5,
        text: "See you then.",
        sender: "other",
        senderName: "Member C",
        profilePic: "https://placehold.co/40x40/0000FF/FFFFFF?text=C",
        timestamp: "2025-07-15T10:08:00.000Z",
      },
      {
        id: 6,
        text: "On my way!",
        sender: "other",
        senderName: "Member D",
        profilePic: "https://placehold.co/40x40/FFFF00/000000?text=D",
        timestamp: "2025-07-15T10:09:00.000Z",
      },
      {
        id: 7,
        text: "Looking forward to it.",
        sender: "other",
        senderName: "Member E",
        profilePic: "https://placehold.co/40x40/FF00FF/FFFFFF?text=E",
        timestamp: "2025-07-15T10:10:00.000Z",
      },
      {
        id: 8,
        text: "Will join shortly.",
        sender: "other",
        senderName: "Member F",
        profilePic: "https://placehold.co/40x40/00FFFF/000000?text=F",
        timestamp: "2025-07-15T10:11:00.000Z",
      },
      {
        id: 9,
        text: "Almost there.",
        sender: "other",
        senderName: "Member G",
        profilePic: "https://placehold.co/40x40/800000/FFFFFF?text=G",
        timestamp: "2025-07-15T10:12:00.000Z",
      },
      {
        id: 10,
        text: "Just arrived.",
        sender: "other",
        senderName: "Member H",
        profilePic: "https://placehold.co/40x40/008000/FFFFFF?text=H",
        timestamp: "2025-07-15T10:13:00.000Z",
      },
    ],
  };

  useEffect(() => {
    setMessages(JSON.parse(JSON.stringify(dummyMessages[chatId] || [])));
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
        senderName: "You",
        timestamp: new Date().toISOString(),
        profilePic: "https://placehold.co/40x40/007BFF/FFFFFF?text=YO",
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleAttachFile = () => {
    console.log("File attachment functionality not yet implemented.");
  };

  const handleVoiceMessage = () => {
    console.log("Voice message functionality not yet implemented.");
  };

  if (!chatId) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Select a chat to start messaging.
      </div>
    );
  }

  let lastDate = null;

  return (
    <div className="right-0 left-0 mx-auto flex h-full flex-col px-2 pt-8 pb-20">
      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => {
          const currentDate = new Date(msg.timestamp);
          const showDateSeparator =
            !lastDate || !isSameDay(lastDate.toISOString(), msg.timestamp);
          lastDate = currentDate;

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="my-4 flex justify-center pt-25">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                </div>
              )}
              <Message
                message={msg}
                senderName={msg.senderName}
                profilePic={msg.profilePic}
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="fixed right-1 bottom-[180px] rounded-2xl p-1 text-base">
        <div className="m relative flex flex-col items-center">
          {/* Blue pill-shaped element */}
          <div className="justify-center rounded-full bg-blue-500 px-4 text-center text-xl font-semibold text-white shadow-lg">
            <span className="text-center text-xs"> 35</span>
          </div>

          {/* Dark grey circular element with chevron */}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-600 p-2 shadow-lg"
            onClick={() =>
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {/* FaChevronDown আইকন ব্যবহার করা হলো */}
            <MdKeyboardDoubleArrowDown className="flex h-10 w-10 justify-center text-white" />
          </div>
        </div>
      </div>

      {/* Message Input Form */}
      {/* MdKeyboardDoubleArrowDown icon fixed above form */}

      <form
        onSubmit={handleSendMessage}
        className="hadow-md fixed right-0 bottom-0 left-0 flex-shrink-0 rounded-lg bg-gray-50 py-4"
      >
        <div className="flex w-[380px] items-center space-x-2 px-6">
          <button
            type="button"
            onClick={handleAttachFile}
            className="flex-shrink-0 rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-500"
            title="Attach File"
          >
            <HiOutlinePaperClip className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={handleVoiceMessage}
            className="flex-shrink-0 rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-500"
            title="Voice Message"
          >
            <FaMicrophone className="h-6 w-6" />
          </button>
          <textarea // Changed from input to textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write message..."
            className="min-w-0 flex-1 resize-none rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" // Added resize-none and adjusted padding for better appearance
            rows="1" // Start with 1 row, will expand as needed
            style={{ minHeight: "42px", maxHeight: "150px", overflowY: "auto" }} // Added inline style for min/max height and overflow
          />

          <button
            type="submit"
            className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700"
            title="Send Message"
          >
            <IoMdArrowUp className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

const ChatListPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedParticipantName, setSelectedParticipantName] = useState(null);
  const [selectedChatType, setSelectedChatType] = useState(null);
  const [activeTab, setActiveTab] = useState("groups");
  const [totalMessagesCount, setTotalMessagesCount] = useState(32); // Dummy count
  const [searchTerm, setSearchTerm] = useState("");

  // Private Chats Dummy Data (updated for professional styling)
  const [privateChats, setPrivateChats] = useState([
    {
      id: "chat_phone_1",
      type: "private",
      participantName: "Munshi",
      lastMessage: "Brother, can you share the GCR code for electrical...",
      lastMessageTimestamp: "2025-07-10T10:20:00.000Z", // 10/7/25
      profilePic: "https://placehold.co/56x56/D1D5DB/4B5563?text=P", // Placeholder for image initial P
      isVoiceCall: false,
    },
    {
      id: "chat_shaukatul_islam",
      type: "private",
      participantName: "Islam",
      lastMessage: "Draft: A",
      lastMessageTimestamp: "2025-07-04T12:00:00.000Z", // 14/4/25
      profilePic: "https://placehold.co/56x56/D3D3D3/000000?text=SS",
      isVoiceCall: false,
    },
    {
      id: "chat_urmila_fd_nub",
      type: "private",
      participantName: "Milon",
      lastMessage: "ok",
      lastMessageTimestamp: "2025-07-10T14:30:00.000Z", // 10/7/25
      profilePic: "https://placehold.co/56x56/9400D3/FFFFFF?text=UN",
      isVoiceCall: false,
    },
    {
      id: "chat_phone_2",
      type: "private",
      participantName: "roy",
      lastMessage: "Voice Call",
      lastMessageTimestamp: "2025-07-05T09:30:00.000Z", // 5/7/25
      profilePic: "https://placehold.co/56x56/000000/FFFFFF?text=S", // Initial 'S' as per image
      isVoiceCall: true,
    },
    {
      id: "chat_mafuj_vai",
      type: "private",
      participantName: "roky",
      lastMessage: "Voice Call",
      lastMessageTimestamp: "2025-07-05T10:00:00.000Z", // 5/7/25
      profilePic: "https://placehold.co/56x56/8B4513/FFFFFF?text=MV", // Generic profile pic
      isVoiceCall: true,
    },
    // Existing private chats (you can keep them or remove as needed)
    {
      id: "chat1",
      type: "private",
      participantName: "Nayem Islam",
      lastMessage: "Insha'Allah.",
      lastMessageTimestamp: "2025-07-15T11:47:30.000Z",
      profilePic: "https://placehold.co/56x56/FF5733/FFFFFF?text=NI",
      isVoiceCall: false,
    },
    {
      id: "chat2",
      type: "private",
      participantName: "Faruk Ahmed",
      lastMessage: "It can be slightly lowered.",
      lastMessageTimestamp: "2025-07-12T09:05:00.000Z",
      profilePic: "https://placehold.co/56x56/33FF57/FFFFFF?text=FA",
      isVoiceCall: false,
    },
    {
      id: "chat3",
      type: "private",
      participantName: "Alif Hossain",
      lastMessage: "I'm good, thanks! How about you?",
      lastMessageTimestamp: "2025-07-14T14:32:00.000Z",
      profilePic: "https://placehold.co/56x56/5733FF/FFFFFF?text=AH",
      isVoiceCall: false,
    },
    {
      id: "chat4",
      type: "private",
      participantName: "Taslima Begum",
      lastMessage: "Yes, I did. Thanks!",
      lastMessageTimestamp: "2025-07-11T10:05:00.000Z",
      profilePic: "https://placehold.co/56x56/FF33A1/FFFFFF?text=TB",
      isVoiceCall: false,
    },
  ]);

  // Dummy data for the single site-wide group chat
  const [groupChats] = useState([
    {
      id: "site_main_group", // Unique ID for the main site group
      type: "group",
      participantName: "Community Group", // Generic name for the site's main group
      lastMessage:
        "Welcome to the Community Group! Please introduce yourselves.",
      lastMessageTimestamp: "2025-07-15T09:00:00.000Z",
      profilePic: "https://placehold.co/56x56/3357FF/FFFFFF?text=CG", // Generic group profile pic
    },
  ]);

  const handleSelectChat = (chatId, participantName, chatType) => {
    setSelectedChatId(chatId);
    setSelectedParticipantName(participantName);
    setSelectedChatType(chatType);
  };

  const handleBackToChatList = () => {
    setSelectedChatId(null);
    setSelectedParticipantName(null);
    setSelectedChatType(null);
  };

  // Set default selected chat when the component mounts or activeTab changes
  useEffect(() => {
    if (activeTab === "groups") {
      const defaultGroupChat = groupChats[0];
      if (defaultGroupChat) {
        setSelectedChatId(defaultGroupChat.id);
        setSelectedParticipantName(defaultGroupChat.participantName);
        setSelectedChatType(defaultGroupChat.type);
      }
    } else if (activeTab === "private" && privateChats.length > 0) {
      // For private, don't auto-select if on mobile, keep list visible
      // Only auto-select if on larger screen for side-by-side
      if (window.innerWidth >= 768) {
        // md breakpoint for Tailwind CSS
        setSelectedChatId(privateChats[0].id);
        setSelectedParticipantName(privateChats[0].participantName);
        setSelectedChatType(privateChats[0].type);
      } else {
        setSelectedChatId(null); // Keep list visible on mobile by default
        setSelectedParticipantName(null);
        setSelectedChatType(null);
      }
    } else {
      setSelectedChatId(null);
      setSelectedParticipantName(null);
      setSelectedChatType(null);
    }
  }, [activeTab, groupChats, privateChats]);

  // Filter private chats based on search term
  const filteredPrivateChats = privateChats.filter((chat) =>
    chat.participantName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const { t, isRTL } = useLanguage();
  return (
    <div className="font-inter lg-hidden block flex-col bg-gray-100 antialiased sm:hidden">
      {/* Global Header for Chat Page - Always visible */}
      <div className="fixed mx-auto mt-[-10px] w-full flex-shrink-0 border-b border-gray-200 bg-white p-4">
        <div className="top-0 flex items-center justify-between">
          <h6 className="py-1/5 top-0% text-[15px] font-bold text-gray-900">
            {t?.mbailfooter?.massage}({totalMessagesCount})
          </h6>
          <Link to="/" className="ml-2 flex items-center gap-2">
            <FaArrowLeft />
          </Link>
        </div>

        {/* Tab Navigation - Always visible */}
        <div className="mt-1 flex justify-around rounded-lg border border-gray-200 bg-gray-100 p-1">
          <button
            className={`flex-1 rounded-md py-2 text-center text-[14px] font-medium ${
              activeTab === "groups"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            } transition-colors`}
            onClick={() => setActiveTab("groups")}
          >
            {t?.mbailfooter?.groups}
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-center text-[14px] font-medium ${
              activeTab === "private"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-200"
            } ml-1 transition-colors`}
            onClick={() => setActiveTab("private")}
          >
            {t?.mbailfooter?.privade}
          </button>
        </div>
        {/* Search Bar - Always visible */}
        <div className="relative mt-2">
          <input
            type="text"
            placeholder={`${t?.mbailfooter?.search}...`}
            className="w-full rounded-full border border-gray-300 py-[6px] pr-4 pl-10 shadow-orange-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="b absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
          {searchTerm && (
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
              onClick={() => setSearchTerm("")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Conditionally renders ChatList or ChatWindow */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Chat List View (visible if no chat selected on mobile/tablet OR always on desktop) */}
        <div
          className={`flex w-full flex-col border-r border-gray-200 bg-white md:w-1/3 ${
            selectedChatId ? "hidden md:flex" : "flex" // Hides on mobile if chat selected
          }`}
        >
          {activeTab === "groups" ? (
            <ChatList
              chats={groupChats}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChatId}
              type="groups"
            />
          ) : (
            <ChatList
              chats={filteredPrivateChats}
              onSelectChat={handleSelectChat}
              selectedChatId={selectedChatId}
              type="private"
            />
          )}
        </div>

        {/* Chat Window View (visible if chat selected on mobile/tablet OR always on desktop) */}
        <div
          className={`flex w-full flex-1 flex-col ${
            selectedChatId ? "flex" : "hidden" // Shows on mobile if chat selected
          } md:flex`}
          // linear-gradient এর রঙ এবং অপাসিটি পরিবর্তন করুন
          // top এ গাঢ় সবুজ থেকে bottom এ হালকা সবুজাভ সাদায় গ্রেডিয়েন্ট
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(34, 139, 34, 0.2), rgba(255, 255, 255, 0.3)), url("/assets/demo/whatsapp color.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          {selectedChatId && (
            <div className="flex flex-shrink-0 items-center border-b border-gray-200 px-8">
              <button
                onClick={handleBackToChatList}
                className="mr-2 rounded-full hover:bg-gray-200 md:hidden" // Back button only on mobile/tablet
                title="Back to Chats"
              >
                <IoArrowBack className="h-6 w-6 text-gray-600" />
              </button>
              <h2 className="text-[14px] font-semibold text-gray-800">
                {selectedParticipantName}
              </h2>
            </div>
          )}
          <ChatWindow
            chatId={selectedChatId}
            participantName={selectedParticipantName}
            chatType={selectedChatType}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
