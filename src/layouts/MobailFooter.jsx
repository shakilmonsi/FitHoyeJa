import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HomeButton from "../components/footerComponent/HomeButton";
import CommercialButton from "../components/footerComponent/CommercialButton";
import PostAdButton from "../components/footerComponent/PostAdButton";
import ChatButton from "../components/footerComponent/ChatButton";
import SearchButton from "../components/footerComponent/SearchButton";

const MobailFooter = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname.startsWith("/agents")) {
      setActiveTab("commercial");
    } else if (
      location.pathname.startsWith("/post-ad") ||
      location.pathname.startsWith("/ad-upload")
    ) {
      setActiveTab("ad-upload");
    } else if (location.pathname.startsWith("/chat")) {
      setActiveTab("chat");
    } else if (location.pathname.startsWith("/search")) {
      setActiveTab("search");
    } else {
      setActiveTab(""); // fallback
    }
  }, [location.pathname]);

  const handleButtonClick = (tabName, path) => {
    setActiveTab(tabName);
    navigate(path);
  };

  // const handleSearchClick = () => {
  //   setActiveTab("search");
  //   navigate("/search");
  // };

  if (
    location.pathname === "/ad-upload" ||
    location.pathname.startsWith("/post-ad") ||
    location.pathname.startsWith("/search")
  ) {
    return null;
  }

  return (
    <div className="t-100 fixed right-0 bottom-0 left-0 z-50 flex border-t border-gray-300 bg-white py-2 lg:hidden">
      <HomeButton
        isActive={activeTab === "home"}
        onClick={() => handleButtonClick("home", "/")}
      />
      <CommercialButton
        isActive={activeTab === "commercial"}
        onClick={() => handleButtonClick("commercial", "/agents")}
      />
      <PostAdButton
        isActive={activeTab === "ad-upload"}
        onClick={() => handleButtonClick("ad-upload", "/ad-upload")}
      />
      <ChatButton
        isActive={activeTab === "chat"}
        onClick={() => handleButtonClick("chat", "/chat")}
      />
      <SearchButton
        isActive={activeTab === "home"}
        onClick={() => handleButtonClick("home", "/")}
      />
    </div>
  );
};

export default MobailFooter;
