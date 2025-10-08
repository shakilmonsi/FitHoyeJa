// src/components/shared/ChatWindow.jsx  (পাথ আপনার প্রোজেক্ট মতো)
import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";

// ⚠️ এখানে initializeApp করার দরকার নেই — আমরা ready app ইমপোর্ট করব
import { app } from "../../firebase.config";

// Firestore (modular API)
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Auth (modular API)
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";

// ✅ একবারই instance নিন (ডুপ্লিকেট app বানাবেন না)
const db = getFirestore(app);
const auth = getAuth(app);

// ---- helpers (date formatting) ----
const formatDateSeparator = (isoString) => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isSameDay = (aIso, bIso) => {
  const a = new Date(aIso),
    b = new Date(bIso);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const ChatWindow = ({ chatId, participantName, chatType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName] = useState("You");
  const messagesEndRef = useRef(null);

  // ---- Auth listener ----
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        return;
      }
      try {
        if (typeof __initial_auth_token !== "undefined") {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
        setUserId(auth.currentUser?.uid || crypto.randomUUID());
      } catch (e) {
        console.error("Firebase authentication error:", e);
        setUserId(crypto.randomUUID());
      }
    });
    return () => unsub();
  }, []);

  // ---- Messages subscription ----
  useEffect(() => {
    if (!chatId || !db || !userId) return;

    const base =
      chatType === "group"
        ? `artifacts/${import.meta.env.VITE_appId || "default"}/public/data/group_chats/${chatId}/messages`
        : `artifacts/${import.meta.env.VITE_appId || "default"}/public/data/private_chats/${chatId}/messages`;

    const messagesCol = collection(db, base);
    const q = query(messagesCol); // orderBy না দিয়ে পরে sort করব

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            timestamp:
              d?.timestamp?.toDate?.()?.toISOString() ??
              new Date().toISOString(),
          };
        });
        rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(rows);
      },
      (err) => console.error("Error fetching messages:", err),
    );

    return () => unsub();
  }, [chatId, userId, chatType]);

  // ---- autoscroll ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- send ----
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const base =
      chatType === "group"
        ? `artifacts/${import.meta.env.VITE_appId || "default"}/public/data/group_chats/${chatId}/messages`
        : `artifacts/${import.meta.env.VITE_appId || "default"}/public/data/private_chats/${chatId}/messages`;

    try {
      await addDoc(collection(db, base), {
        text: newMessage.trim(),
        sender: "me",
        senderId: userId,
        senderName: userName,
        timestamp: serverTimestamp(),
        profilePic: `https://placehold.co/40x40/007BFF/FFFFFF?text=${userName.charAt(0)}`,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleAttachFile = () => {
    console.log("File attachment functionality not yet implemented.");
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
    <div className="mx-auto flex h-full flex-col bg-white px-5 pb-4">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {participantName}
        </h2>
        {userId && (
          <span className="text-sm text-gray-500">Your ID: {userId}</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg) => {
          const currentDate = new Date(msg.timestamp);
          const showDateSeparator =
            !lastDate || !isSameDay(lastDate.toISOString(), msg.timestamp);
          lastDate = currentDate;

          const isMyMessage = msg.senderId === userId;

          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && (
                <div className="my-4 flex justify-center">
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">
                    {formatDateSeparator(msg.timestamp)}
                  </span>
                </div>
              )}
              <Message
                message={{ ...msg, sender: isMyMessage ? "me" : "other" }}
                senderName={isMyMessage ? "You" : msg.senderName}
                profilePic={msg.profilePic}
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex-shrink-0 rounded-lg bg-gray-50 p-4 shadow-md"
      >
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAttachFile}
            className="flex-shrink-0 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-500"
            title="Attach File"
          >
            {/* your icon */}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700"
            title="Send Message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
