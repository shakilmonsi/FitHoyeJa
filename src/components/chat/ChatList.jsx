import React from "react";

// ChatListItem component for individual chat entries in the list
const ChatListItem = ({ chat, onSelectChat, isSelected }) => {
  // Format the timestamp for the last message
  const formatLastMessageTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Check if the message was sent today
    if (date >= today) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    // Check if the message was sent yesterday
    else if (date >= yesterday) {
      return "Yesterday";
    }
    // Otherwise, show the date
    else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div
      className={`flex cursor-pointer items-center rounded-lg p-4 transition-colors duration-200 ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={() => onSelectChat(chat.id, chat.participantName)}
    >
      <img
        src={
          chat.profilePic ||
          `https://placehold.co/40x40/CCCCCC/000000?text=${chat.participantName.charAt(0)}`
        }
        alt={`${chat.participantName}'s profile`}
        className="mr-4 h-12 w-12 rounded-full object-cover"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = `https://placehold.co/40x40/CCCCCC/000000?text=${chat.participantName.charAt(0)}`;
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {chat.participantName}
          </h3>
          <span className="text-xs text-gray-500">
            {formatLastMessageTime(chat.lastMessageTimestamp)}
          </span>
        </div>
        <p className="truncate text-sm text-gray-600">{chat.lastMessage}</p>
      </div>
    </div>
  );
};

// ChatList component to display a list of chat items
const ChatList = ({ chats, onSelectChat, selectedChatId, type }) => {
  return (
    <div className="h-full space-y-2 overflow-y-auto p-4">
      {chats.length === 0 ? (
        <div className="mt-4 text-center text-gray-500">
          No {type} chats available.
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

export default ChatList;
