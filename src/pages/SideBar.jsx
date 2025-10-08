import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useContext, useMemo, useCallback } from "react";
import {
  FiCreditCard,
  FiHome,
  FiInstagram,
  FiList,
  FiLogIn,
  FiLogOut,
  FiSettings,
  FiTrash,
  FiTwitter,
  FiUserPlus,
  FiX,
} from "react-icons/fi";
import { BsBuildings, BsWhatsapp } from "react-icons/bs";
import {
  FaBell,
  FaCommentDots,
  FaPlusCircle,
  FaWhatsapp,
} from "react-icons/fa";

import { NotificationContext } from "../context/NotificationContext/NotificationContext";

const SideBar = ({ sidebarOpen, toggleSidebar }) => {
  const { isRTL, t, toggleLanguage } = useLanguage();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { unreadCount } = useContext(NotificationContext);

  const handleLogout = useCallback(() => {
    logout();
    toggleSidebar();
  }, [logout, toggleSidebar]);

  const navItems = useMemo(() => {
    const iconClass = "text-primary-900 shrink-0 text-[22px]";
    const base = [
      { label: t.header.home, icon: <FiHome className={iconClass} />, to: "/" },
    ];
    const auth = [
      {
        label: t.header.login,
        icon: <FiLogIn className={iconClass} />,
        to: "/login",
      },
      {
        label: t.header.register,
        icon: <FiUserPlus className={iconClass} />,
        to: "/register",
      },
    ];
    const protectedItems = [
      {
        label: t.header.myAds,
        icon: <FiList className={iconClass} />,
        to: "/my-ads",
      },
      {
        label: t.header.myArchives,
        icon: <FiTrash className={iconClass} />,
        to: "/my-archives",
      },
      {
        label: t.header.buyCredit,
        icon: <FiCreditCard className={iconClass} />,
        to: "/buy-credits",
      },
      {
        label: t.header.logout,
        icon: <FiLogOut className={iconClass} />,
        action: handleLogout,
      },
    ];

    const addPostItem = {
      label: t.mbailfooter.addPost,
      icon: <FaPlusCircle className="text-xl text-[#F78A6F]" />,
      to: isAuthenticated ? "/ad-upload" : "/login",
    };

    const end = [
      {
        label: t.header.agents,
        icon: <BsBuildings className={iconClass} />,
        to: "/agents",
      },
      // {
      //   label: t.header.groupChat,
      //   icon: <FaCommentDots className={iconClass} />,
      //   to: "/chats",
      // },
      {
        label: t.header.notication,
        icon: <FaBell className={iconClass} />,
        to: "/demonoitfication",
      },
      addPostItem,
    ];

    return [...base, ...(isAuthenticated ? protectedItems : auth), ...end];
  }, [isAuthenticated, t, handleLogout, unreadCount]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full min-w-[300px] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <NavLink
                to="/"
                className="flex items-center gap-2"
                onClick={toggleSidebar}
              >
                <img src="/logo.png" alt="Logo" className="w-14" />
                <div>
                  <p className="text-xl font-bold capitalize">{t.site.name}</p>
                  <p className="bg-primary-300 mx-auto w-fit rounded-md px-2 py-1 text-[10px] leading-normal text-white">
                    {t.site.tagline}
                  </p>
                </div>
              </NavLink>
              <button onClick={toggleSidebar} className="text-gray-500">
                <FiX className="text-3xl" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {navItems.map((item, index) => (
              <div key={index} className="active:bg-active rounded-e-2xl">
                {item.to ? (
                  <NavLink
                    to={item.to}
                    onClick={toggleSidebar}
                    className={({ isActive }) =>
                      `hover:bg-primary-300/20 hover:text-primary-900 text-dark my-0.5 flex w-full items-center gap-3 py-3 ps-6 font-bold ${
                        isActive ? "bg-primary-300/20 text-primary-900" : ""
                      }`
                    }
                  >
                    {/* এখানে "add post" বাটনের জন্য আলাদা রেন্ডারিং লজিক ব্যবহার করা হয়েছে */}
                    {item.label === t.mbailfooter.addPost ? (
                      <div className="flex flex-col items-center gap-1">
                        {item.icon}
                        <span className="text-[12px] leading-none font-bold text-[#696969]">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <>
                        {item.icon}
                        <span className="text-[16px] leading-none">
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                ) : (
                  <button
                    onClick={item.action}
                    className="text-dark hover:bg-primary-300/20 hover:text-primary-700 flex w-full items-center gap-3 py-3 ps-6 font-bold"
                  >
                    {item.icon}
                    <span className="text-[16px] leading-none">
                      {item.label}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="mt-4 flex items-center justify-center gap-4">
              {isAuthenticated && (
                <Link
                  to="/settings"
                  className="bg-primary-300/20 text-primary-900 flex h-11 w-11 items-center justify-center rounded-md p-0"
                  onClick={toggleSidebar}
                >
                  <FiSettings className="h-6 w-6" />
                </Link>
              )}
              <button
                onClick={() => toggleLanguage(isRTL ? "en" : "ar")}
                className="bg-primary-300/20 text-primary-900 flex h-11 w-11 items-center justify-center rounded-md p-0"
              >
                <span
                  className={`text-[18px] font-bold ${isRTL ? "" : "relative bottom-0.5"}`}
                >
                  {isRTL ? "En" : "ع"}
                </span>
              </button>
              <a
                target="_blank"
                href="https://www.instagram.com/mraqar"
                rel="noopener noreferrer"
                className="bg-primary-300/20 text-primary-900 flex h-11 w-11 items-center justify-center rounded-md p-0"
              >
                <FiInstagram className="h-6 w-6" />
              </a>
              <a
                target="_blank"
                href="https://x.com/mr_aqar_"
                rel="noopener noreferrer"
                className="bg-primary-300/20 text-primary-900 flex h-11 w-11 items-center justify-center rounded-md p-0"
              >
                <FiTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/96590078005"
                className="bg-primary-300/20 text-primary-900 flex h-11 w-11 items-center justify-center rounded-md p-0"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
