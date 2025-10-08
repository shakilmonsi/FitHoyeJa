import React from "react";

// Message component to display individual chat messages.
// It differentiates between the current user's messages ("me") and others' messages ("other").
const Message = ({ message, senderName, profilePic }) => {
  // Determine if the message is from the current user or another participant
  const isMyMessage = message.sender === "me";

  // Format the timestamp to a readable time (e.g., "10:30 AM")
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use AM/PM format
    };
    return date.toLocaleTimeString("en-US", options);
  };

  return (
    <div
      className={`flex items-end ${isMyMessage ? "justify-end" : "justify-start"}`}
    >
      {!isMyMessage && profilePic && (
        // Display sender's profile picture for "other" messages
        <img
          src={profilePic}
          alt={`${senderName}'s profile`}
          className="mr-2 h-8 w-8 rounded-full object-cover"
          // Fallback for broken image links
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `https://placehold.co/40x40/CCCCCC/000000?text=${senderName.charAt(0)}`;
          }}
        />
      )}
      <div
        className={`flex max-w-[70%] flex-col rounded-lg p-3 ${
          isMyMessage
            ? "rounded-br-none bg-blue-500 text-white" // Styling for my messages
            : "rounded-bl-none bg-gray-200 text-gray-800" // Styling for other messages
        }`}
      >
        {!isMyMessage && (
          // Display sender's name for "other" messages
          <span className="mb-1 text-xs font-semibold text-gray-600">
            {senderName}
          </span>
        )}
        <p className="text-sm break-words">{message.text}</p>
        <span
          className={`mt-1 text-xs ${isMyMessage ? "text-blue-100" : "text-gray-500"}`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
      {isMyMessage && (
        // Optional: You can add a small placeholder for "my" profile pic if needed
        // For simplicity, we're omitting it here as it's often not shown for the current user's messages
        <div className="ml-2 h-8 w-8"></div>
      )}
    </div>
  );
};

export default Message;
