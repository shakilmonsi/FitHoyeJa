import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { NavLink, Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiSettings } from "react-icons/fi";
import { FaBars, FaPlusCircle } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  isActive
    ? "text-[#26b1e6] border-b-2 border-[#26b1e6] pb-1"
    : "hover:text-[#26b1e6] transition-colors";

function Header({ sidebarOpen, toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    isRTL,
    t,
    toggleLanguage,
    language,
    FloatingActionButton,
    setFloatingActionButton,
  } = useLanguage();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const propertyDropdownRef = useRef(null);

  // toggleSidebar
  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  //   setFloatingActionButton(!FloatingActionButton);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        propertyDropdownRef.current &&
        !propertyDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLanguageChange = (lang) => {
    toggleLanguage(lang);
  };

  const handleLogout = () => logout();

  const navItems = useMemo(() => {
    const base = [{ label: t.header.home, to: "/" }];
    const auth = [
      { label: t.header.login, to: "/login" },
      { label: t.header.register, to: "/register" },
    ];
    const protectedItems = [
      { label: t.header.myAds, to: "/my-ads" },
      { label: t.header.myArchives, to: "/my-archives" },
      { label: t.header.buyCredit, to: "/buy-credits" },
      { label: t.header.logout, action: handleLogout },
    ];

    const end = [{ label: t.header.agents, to: "/agents" }];
    return [...base, ...(isAuthenticated ? protectedItems : auth), ...end];
  }, [isAuthenticated, t]);

  return (
    <nav
      className={`relative z-50 border-b border-gray-200 bg-white px-4 py-4 shadow-sm ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo and Site Name */}
        <NavLink
          to="/"
          className={`hidden items-center justify-start gap-2 md:block`}
        >
          <img src="/logo.png" alt="Logo" className="w-18" />
          <div>
            <p className="text-lg font-bold capitalize">{t.site.name}</p>
            <p className="bg-primary-300 mx-auto w-fit rounded-md px-2 py-1 text-[8px] leading-normal text-white">
              {t.site.tagline}
            </p>
          </div>
        </NavLink>

        {/* Mobile Hamburger Menu Button */}

        <button
          onClick={toggleSidebar}
          className="text-2xl text-[#556885] lg:hidden"
        >
          <FaBars />
        </button>

        {/* Desktop Navigation Links */}
        <div
          className={`hidden items-center gap-6 font-bold text-black lg:flex ${
            isRTL ? "space-x-reverse" : ""
          }`}
        >
          <Navigation
            toggleDropdown={toggleDropdown}
            isDropdownOpen={isDropdownOpen}
            handleLanguageChange={handleLanguageChange}
            isRTL={isRTL}
            t={t}
            language={language}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
            navItems={navItems}
            propertyDropdownRef={propertyDropdownRef}
            setIsDropdownOpen={setIsDropdownOpen}
          />

          {isAuthenticated && (
            <Link to="/settings">
              <FiSettings />
            </Link>
          )}
        </div>

        {/* Desktop 'Add Free Ad' Button (original) */}
        <NavLink
          to={isAuthenticated ? "/ad-upload" : "/login"}
          className="bg-primary-300/10 border-primary-300/40 hidden items-center gap-2 rounded-md border px-8 py-3 lg:flex"
        >
          <FaPlusCircle className="text-primary-600 text-lg" />
          {t.header.addFreeAd}
        </NavLink>
      </div>
    </nav>
  );
}

const Navigation = ({
  toggleDropdown,
  isDropdownOpen,
  handleLanguageChange,
  isRTL,
  t,
  isMobile = false,
  isAuthenticated,
  handleLogout,
  navItems,
  propertyDropdownRef,
  setIsDropdownOpen,
}) => {
  const [propertyTypes, setPropertyTypes] = useState([]);

  const { language } = useLanguage();
  // propertyTypeData লোড করার জন্য useEffect
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        // ভাষার উপর ভিত্তি করে সঠিক JSON ফাইলটি লোড করা হচ্ছে
        const url =
          language === "ar"
            ? "/groupPropertyTypesArbic.json"
            : "/groupPropertyTypes.json";
        const response = await fetch(url);
        const data = await response.json();
        setPropertyTypes(data);
      } catch (error) {
        console.error("Error fetching property types data:", error);
      }
    };

    fetchPropertyTypes();
  }, [language]);

  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-4" : "items-center gap-6"} ${
        isRTL && !isMobile ? "space-x-reverse" : ""
      }`}
    >
      {navItems.map((item, index) => (
        <div className="active:bg-active rounded-e-2xl" key={index}>
          {item.to ? (
            <NavLink to={item.to} className={navLinkClass}>
              <h2
                className={
                  isRTL ? "text-right !font-bold" : "text-left !font-bold"
                }
              >
                {item.label}
              </h2>
            </NavLink>
          ) : (
            <button onClick={item.action}>
              <h2>{item.label}</h2>
            </button>
          )}
        </div>
      ))}

      {!isAuthenticated && (
        <div className="relative" ref={propertyDropdownRef}>
          <button
            onClick={toggleDropdown}
            className={`hover:text-primary-500 flex cursor-pointer items-center transition-colors ${
              isDropdownOpen ? "text-primary-500" : ""
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h2>{t.header.kuwaitRealEstate}</h2>
            {isDropdownOpen ? (
              <FiChevronUp className={`${isRTL ? "mr-1" : "ml-1"}`} />
            ) : (
              <FiChevronDown className={`${isRTL ? "mr-1" : "ml-1"}`} />
            )}
          </button>

          {isDropdownOpen && propertyTypes.length > 0 && (
            <div
              className={`absolute z-10 mt-2 max-h-[40vh] w-fit min-w-64 divide-y divide-gray-100 overflow-y-auto rounded-md border border-gray-100 bg-white shadow ${
                isRTL ? "right-0" : "left-0"
              }`}
            >
              {propertyTypes.map((item, index) => (
                <div key={index} className="p-3">
                  {Array.isArray(item.properties) &&
                    item.properties.length > 0 && (
                      <>
                        <p className="mb-2 text-base font-[700] text-gray-800">
                          {item.title}
                        </p>
                        {item.properties.map((subItem, subIndex) => (
                          <div key={subIndex}>
                            <NavLink
                              to={`/search?transactionType=${item.id}&propertyType=${subItem.id}`}
                              className={`text-primary-900 my-0.5 block rounded px-2 py-1 text-sm font-[700]`}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {subItem.name}
                            </NavLink>
                          </div>
                        ))}
                      </>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <button onClick={() => handleLanguageChange(isRTL ? "en" : "ar")}>
          <h2 className={`text-xl ${isRTL ? "" : "relative bottom-1"}`}>
            {isRTL ? "En" : "ع"}
          </h2>
        </button>
      </div>
    </div>
  );
};
export default Header;
