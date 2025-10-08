import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuChevronDown, LuSearch, LuX } from "react-icons/lu";
import {
  FaArrowRight,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaRegSquare,
  FaCheckSquare,
} from "react-icons/fa";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import SideBar from "../SideBar";
import FabController from "../fab/FabController";
import axios from "../../utils/axiosInstance";
import { useLanguage } from "../../context/LanguageContext";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

const HorizontalScroller = ({ children }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isRTL = document.documentElement.dir === "rtl";

  const checkArrows = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const isScrollable = scrollWidth > clientWidth;
    if (isRTL) {
      setShowLeftArrow(isScrollable && scrollLeft !== 0);
      setShowRightArrow(
        isScrollable && Math.abs(scrollLeft) < scrollWidth - clientWidth - 1,
      );
    } else {
      setShowLeftArrow(isScrollable && scrollLeft > 0);
      setShowRightArrow(
        isScrollable && scrollLeft < scrollWidth - clientWidth - 1,
      );
    }
  }, [isRTL]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkArrows();
    window.addEventListener("resize", checkArrows);
    container.addEventListener("scroll", checkArrows);
    return () => {
      window.removeEventListener("resize", checkArrows);
      container.removeEventListener("scroll", checkArrows);
    };
  }, [checkArrows]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const amount =
        direction === "left"
          ? isRTL
            ? scrollAmount
            : -scrollAmount
          : isRTL
            ? -scrollAmount
            : scrollAmount;
      container.scrollBy({ left: amount, behavior: "smooth" });
      setTimeout(() => checkArrows(), 350);
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => scroll("left")}
        className={`absolute top-0 bottom-0 ${
          isRTL ? "right-0" : "left-0"
        } z-10 flex items-center bg-gradient-to-${
          isRTL ? "l" : "r"
        } from-white via-white/80 to-transparent pr-2 transition-opacity duration-300 ${
          showLeftArrow ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="-mr-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md">
          {isRTL ? (
            <GoChevronRight className="h-5 w-5 text-gray-600" />
          ) : (
            <GoChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </div>
      </button>
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-1"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className={`absolute top-0 bottom-0 ${
          isRTL ? "left-0" : "right-0"
        } z-10 flex items-center bg-gradient-to-${
          isRTL ? "r" : "l"
        } from-white via-white/80 to-transparent pl-2 transition-opacity duration-300 ${
          showRightArrow ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="-ml-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md">
          {isRTL ? (
            <GoChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <GoChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </div>
      </button>
    </div>
  );
};

const MobileDropdownPanel = ({ children, onToggle, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40" onClick={onToggle}>
      <div
        type="radio"
        className="absolute top-[130px] right-4 left-4 mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DesktopDropdownPanel = ({
  children,
  isOpen,
  isRTL,
  minWidth = "10rem",
  dropdownRef,
}) => {
  if (!isOpen) return null;
  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full z-20 mt-1 rounded-md border border-gray-200 bg-white p-1 shadow-lg ${
        isRTL ? "left-0" : "right-0 sm:right-auto sm:left-0"
      }`}
      style={{ minWidth }}
    >
      {children}
    </div>
  );
};

const DesktopRegionFilter = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder,
  searchPlaceholder,
  isRTL,
  isOpen,
  onToggle,
  isDesktopView,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };
    if (isOpen && isDesktopView) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle, isDesktopView]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, { ...item }],
    );
  };

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <div
        className={`flex cursor-pointer items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-black transition-colors focus-within:outline-gray-300 hover:bg-[#e8f0f7] ${
          isOpen ? "ring-1 ring-gray-200" : ""
        }`}
        onClick={onToggle}
        role="button"
        tabIndex="0"
      >
        <span className="text-gray-400">
          <LuSearch />
        </span>
        <div
          className={`flex-grow px-2 text-black ${
            isRTL ? "text-right" : "text-left"
          } flex min-h-[24px] flex-wrap gap-1`}
        >
          {selectedItems.length > 0
            ? selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="bg-primary-300/20 flex items-center rounded-md px-2 py-1 text-xs font-medium text-black"
                >
                  {item.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item);
                    }}
                    className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
                  >
                    <LuX />
                  </button>
                </span>
              ))
            : placeholder}
        </div>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <LuChevronDown />
        </span>
      </div>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 text-sm font-medium text-[#556885] ${
                    selectedItems.some((item) => item.id === option.id)
                      ? "bg-primary-300/20"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(option);
                  }}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedItems.some(
                        (item) => item.id === option.id,
                      )}
                      className="form-checkbox h-4 w-4 cursor-pointer rounded"
                    />
                    <span className="ltr:ml-2 rtl:mr-2">{option.name}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="px-4 text-sm text-gray-700">
                      ({option.count})
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-black">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const ScrollableTags = ({ items, onRemoveItem, isRTL }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setCanScrollLeft(hasOverflow && el.scrollLeft > 0);
      setCanScrollRight(
        hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      );
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener("scroll", checkScrollability, { passive: true });
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [items, checkScrollability]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative flex min-w-0 flex-1 items-center">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="z-10 flex h-full items-center bg-white pr-1"
        >
          <div className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
            <FaChevronLeft className="text-gray-600" />
          </div>
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex w-full gap-2 overflow-x-auto scroll-smooth py-1 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((item) => (
          <span
            key={item.id}
            className="flex flex-shrink-0 items-center rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium text-black"
          >
            {item.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item);
              }}
              className={`${isRTL ? "mr-2" : "ml-2"} hover:text-red-500`}
            >
              <LuX size={16} />
            </button>
          </span>
        ))}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="z-10 flex h-full items-center bg-white pl-1"
        >
          <div className="cursor-pointer rounded-full p-2 hover:bg-gray-100">
            <FaChevronRight className="text-gray-600" />
          </div>
        </button>
      )}
    </div>
  );
};

const MobileRegionFilter = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder,
  searchPlaceholder,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isRTL, t } = useLanguage();

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, item],
    );
  };

  const filteredOptions = (options || []).filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-white">
          <div className="flex h-full flex-col">
            {/* ## CORRECTED MODAL HEADER ## */}
            {/* The order of elements is now correct for RTL display */}
            <div className="mt-2 flex items-center gap-2 p-4">
              <button onClick={onToggle} className="p-2 text-2xl text-gray-600">
                <FaArrowRight className="text-[#f78a6f]" />
              </button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-[#f78a6f]/50 bg-white py-3 pr-4 text-left focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <span
                  className={`absolute inset-y-0 flex items-center text-gray-400 ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                ></span>
              </div>
              <button
                onClick={onToggle}
                className="rounded-lg bg-[#f78a6f] px-5 py-3 font-bold text-white"
              >
                {t.home.searchButton || "بحث"}
              </button>
            </div>

            <div className="border-b border-gray-300 p-2">
              <ScrollableTags
                items={selectedItems}
                onRemoveItem={toggleItem}
                isRTL={isRTL}
              />
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.id}
                    className="my-0.5 flex cursor-pointer items-center justify-between rounded-md p-3 text-sm hover:bg-gray-100"
                    onClick={() => toggleItem(option)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        readOnly
                        checked={selectedItems.some(
                          (item) => item.id === option.id,
                        )}
                        className="h-5 w-5 cursor-pointer rounded border-gray-300 text-[#335694] focus:ring-[#335694]"
                      />
                      <span className={`px-3 font-semibold text-gray-700`}>
                        {option.name}
                      </span>
                    </div>
                    {option.properties_count !== undefined &&
                      option.properties_count !== null && (
                        <span className="text-sm text-gray-500">
                          ({option.properties_count})
                        </span>
                      )}
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">
                  {t.search.noResultsFound}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

const CategoryFilter = ({
  options,
  selectedValue,
  setSelectedValue,
  label,
  isOpen,
  onToggle,
  isMobile,
  isRTL,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOpen &&
        !isMobile
      ) {
        onToggle();
      }
    };
    if (isOpen && !isMobile)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle, isMobile]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    if (!isMobile) {
      onToggle();
    }
  };

  const safeOptions = Array.isArray(options) ? options : [];
  const selectedOptionName =
    safeOptions.find((opt) => opt.id.toString() === selectedValue)?.name ||
    label;

  // const DropdownContent = () => (
  //   <ul className="max-h-60 overflow-y-auto">
  //     {safeOptions.map((option) => (
  //       <li
  //         key={option.id}
  //         className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center rounded-md p-2 text-sm font-bold text-[#556885] ${
  //           selectedValue === option.id.toString() ? "bg-primary-300/20" : ""
  //         }`}
  //         onClick={() => handleSelect(option.id.toString())}
  //       >
  //         <span>{option.name}</span>
  //       </li>
  //     ))}
  //   </ul>
  // );

  const DropdownContent = () => (
    <ul className="max-h-60 space-y-1 overflow-y-auto">
      {safeOptions.map((option) => (
        <li
          key={option.id}
          className={`flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100`}
          onClick={() => handleSelect(option.id.toString())}
        >
          {selectedValue === option.id.toString() ? (
            <FaCheckSquare className="text-xl text-blue-800" />
          ) : (
            <FaRegSquare className="text-xl text-gray-400" />
          )}

          <span className="font-[700] text-gray-500 select-none">
            {option.name}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        className={`flex w-full min-w-[120px] items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-black transition-colors focus-within:outline-gray-300 hover:bg-[#e8f0f7] ${
          isOpen ? "!bg-primary-400 text-white" : ""
        }`}
        onClick={onToggle}
      >
        <span>{selectedOptionName}</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <LuChevronDown size={16} />
        </span>
      </button>
      {isMobile ? (
        <MobileDropdownPanel isOpen={isOpen} onToggle={onToggle}>
          <DropdownContent />
        </MobileDropdownPanel>
      ) : (
        <DesktopDropdownPanel
          isOpen={isOpen}
          dropdownRef={dropdownRef}
          isRTL={isRTL}
          minWidth="12rem"
        >
          <DropdownContent />
        </DesktopDropdownPanel>
      )}
    </div>
  );
};

const PropertyDropdown = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder,
  searchPlaceholder,
  isOpen,
  onToggle,
  isMobile,
  isRTL,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMobile) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          onToggle();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle, isMobile]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, { ...item }],
    );
  };

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];

  const DropdownContent = () => (
    <div className="w-full">
      {/* <div className="p-2">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-md border border-gray-300 p-2 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div> */}
      <ul className="max-h-80 overflow-y-auto p-1">
        {filteredOptions.map((option) => (
          <li
            key={option.id}
            className={`hover:bg-primary-300/20 text-md my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 font-[700] text-gray-500 ${
              safeSelectedItems.some((item) => item.id === option.id)
                ? "bg-primary-300/20"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleItem(option);
            }}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                readOnly
                checked={safeSelectedItems.some(
                  (item) => item.id === option.id,
                )}
                className="form-checkbox h-4 w-4 cursor-pointer rounded"
              />
              <span className="ltr:ml-2 rtl:mr-2">{option.name}</span>
            </div>
            {option.count !== undefined && (
              <span className="px-4 text-sm text-gray-700">
                ({option.count})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        className={`flex w-full min-w-[120px] items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-black transition-colors focus-within:outline-gray-300 hover:bg-[#e8f0f7] ${
          isOpen ? "!bg-primary-400 text-white" : ""
        }`}
        onClick={onToggle}
      >
        <span>
          {safeSelectedItems.length > 0
            ? `${placeholder} (${safeSelectedItems.length})`
            : placeholder}
        </span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <LuChevronDown size={16} />
        </span>
      </button>
      {isMobile ? (
        <MobileDropdownPanel isOpen={isOpen} onToggle={onToggle}>
          <DropdownContent />
        </MobileDropdownPanel>
      ) : (
        <DesktopDropdownPanel
          isOpen={isOpen}
          dropdownRef={dropdownRef}
          isRTL={isRTL}
          minWidth="18rem"
        >
          <DropdownContent />
        </DesktopDropdownPanel>
      )}
    </div>
  );
};

function PriceRangeFilter({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  t,
  isRTL,
  isOpen,
  onToggle,
  onApply,
  isMobile,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMobile) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          onToggle();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle, isMobile]);

  const handleSearch = () => {
    onApply();
    onToggle();
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onApply();
    onToggle();
  };

  const DropdownContent = () => (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t.search.minPrice}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
          className={`focus-within:ring-primary-100 w-1/2 rounded-md border border-gray-200 p-2 text-sm focus-within:ring-1 focus-within:outline-none ${
            isRTL ? "text-right" : "text-left"
          }`}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={t.search.maxPrice}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
          className={`focus-within:ring-primary-100 w-1/2 rounded-md border border-gray-200 p-2 text-sm focus-within:ring-1 focus-within:outline-none ${
            isRTL ? "text-right" : "text-left"
          }`}
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
        >
          {t.search.reset}
        </button>
        <button
          onClick={handleSearch}
          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          {t.search.search}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full min-w-[120px] items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-black transition-colors focus-within:outline-gray-300 hover:bg-[#e8f0f7] ${
          isOpen ? "!bg-primary-400 text-white" : ""
        }`}
      >
        <span>{t.search.price}</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <LuChevronDown size={16} />
        </span>
      </button>
      {isMobile ? (
        <MobileDropdownPanel isOpen={isOpen} onToggle={onToggle}>
          <DropdownContent />
        </MobileDropdownPanel>
      ) : (
        <DesktopDropdownPanel
          isOpen={isOpen}
          dropdownRef={dropdownRef}
          isRTL={isRTL}
          minWidth="18rem"
        >
          <div className="p-2">
            <DropdownContent />
          </div>
        </DesktopDropdownPanel>
      )}
    </div>
  );
}

function TextSearchFilter({
  searchTerm,
  setSearchTerm,
  t,
  isRTL,
  isOpen,
  onToggle,
  onApply,
  isMobile,
}) {
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (isOpen && !isMobile) {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          onToggle();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onToggle, isMobile]);

  const handleSearch = () => {
    onApply();
    onToggle();
  };

  const handleReset = () => {
    setSearchTerm("");
    onApply();
    onToggle();
  };

  const DropdownContent = () => (
    <div className="w-full">
      <p className="mb-2 text-sm text-black">
        {t.search.searchUsingTextExample}
      </p>
      <div className="relative">
        <span
          className={`absolute inset-y-0 flex items-center text-gray-400 ${
            isRTL ? "right-3" : "left-3"
          }`}
        >
          <LuSearch />
        </span>
        <input
          type="text"
          placeholder={t.search.searchByText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full rounded-md border border-gray-200 p-2 text-sm focus-within:ring-1 focus-within:ring-gray-100 focus-within:outline-none ${
            isRTL ? "pr-10" : "pl-10"
          }`}
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleReset}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-100"
        >
          {t.search.reset}
        </button>
        <button
          onClick={handleSearch}
          className="bg-primary-400 hover:bg-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white"
        >
          {t.search.search}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full min-w-[120px] items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-black transition-colors focus-within:outline-gray-300 hover:bg-[#e8f0f7] ${
          isOpen ? "!bg-primary-400 text-white" : ""
        }`}
      >
        <span>{t.search.text}</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <LuChevronDown size={16} />
        </span>
      </button>
      {isMobile ? (
        <MobileDropdownPanel isOpen={isOpen} onToggle={onToggle}>
          <DropdownContent />
        </MobileDropdownPanel>
      ) : (
        <DesktopDropdownPanel
          isOpen={isOpen}
          dropdownRef={dropdownRef}
          isRTL={isRTL}
          minWidth="18rem"
        >
          <div className="p-2">
            <DropdownContent />
          </div>
        </DesktopDropdownPanel>
      )}
    </div>
  );
}

const SearchFilterBar = ({
  initialFilters,
  t,
  isRTL,
  children,
  isDesktopView,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(null);
  const [allRegions, setAllRegions] = useState([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [transactionType, setTransactionType] = useState(
    initialFilters.transactionType,
  );
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [searchText, setSearchText] = useState(initialFilters.searchText);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, categoriesRes, propertyTypesRes] = await Promise.all([
          axios.get("/areas"),
          axios.get("/categories"),
          axios.get("/property-types"),
        ]);
        setAllRegions(areasRes.data.data || []);
        setTransactionTypes(categoriesRes.data.data || []);
        setAllPropertyTypes(propertyTypesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchData();
  }, [language]);

  useEffect(() => {
    setTransactionType(initialFilters.transactionType);
    setMinPrice(initialFilters.minPrice);
    setMaxPrice(initialFilters.maxPrice);
    setSearchText(initialFilters.searchText);
    if (allRegions.length > 0) {
      const selectedRegionObjects = allRegions.filter((region) =>
        initialFilters.regions.includes(region.id.toString()),
      );
      setSelectedRegions(selectedRegionObjects);
    } else if (initialFilters.regions.length === 0) {
      setSelectedRegions([]);
    }
    if (allPropertyTypes.length > 0) {
      const selectedPropertyTypeObjects = allPropertyTypes.filter((propType) =>
        initialFilters.propertyTypes.includes(propType.id.toString()),
      );
      setSelectedPropertyTypes(selectedPropertyTypeObjects);
    } else if (initialFilters.propertyTypes.length === 0) {
      setSelectedPropertyTypes([]);
    }
  }, [initialFilters, allRegions, allPropertyTypes]);

  const updateURLFromManualFilters = () => {
    const params = new URLSearchParams();
    if (transactionType) params.set("transactionType", transactionType);
    selectedRegions.forEach((region) => params.append("region", region.id));
    selectedPropertyTypes.forEach((type) =>
      params.append("propertyType", type.id),
    );
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (searchText) params.set("searchText", searchText);
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (transactionType) {
        params.set("transactionType", transactionType);
      } else {
        params.delete("transactionType");
      }

      params.delete("region");
      selectedRegions.forEach((region) => params.append("region", region.id));

      params.delete("propertyType");
      selectedPropertyTypes.forEach((type) =>
        params.append("propertyType", type.id),
      );

      navigate(`/search?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [
    selectedRegions,
    selectedPropertyTypes,
    transactionType,
    navigate,
    location.search,
  ]);

  const toggleDropdown = useCallback((dropdownName) => {
    setShowDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  }, []);

  const handleApplyFilter = () => {
    updateURLFromManualFilters();
  };

  const filterProps = {
    allRegions,
    selectedRegions,
    setSelectedRegions,
    allPropertyTypes,
    selectedPropertyTypes,
    setSelectedPropertyTypes,
    transactionTypes,
    transactionType,
    setTransactionType,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchText,
    setSearchText,
    t,
    isRTL,
    showDropdown,
    toggleDropdown,
    onApply: handleApplyFilter,
    isDesktopView,
  };
  return children(filterProps);
};

export default function SearchPageHeader() {
  const { isRTL, t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isDesktopView = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 1279px)");
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      transactionType: params.get("transactionType") || "",
      regions: params.getAll("region"),
      propertyTypes: params.getAll("propertyType"),
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      searchText: params.get("searchText") || "",
    };
  }, [location.search]);

  return (
    <>
      <nav
        className="mt-4 border-b border-gray-200 bg-white px-4 pt-1 pb-3 shadow-sm"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <SearchFilterBar
          initialFilters={initialFilters}
          t={t}
          isRTL={isRTL}
          isDesktopView={isDesktopView}
        >
          {(props) => (
            <div className="mx-auto max-w-7xl">
              {isDesktopView && (
                <div className="flex items-center justify-start gap-5">
                  <div className="flex items-center gap-10">
                    <button
                      onClick={toggleSidebar}
                      className="text-2xl text-[#556885]"
                    >
                      <FaBars />
                    </button>
                    <NavLink
                      to="/"
                      className="flex items-center justify-start gap-2"
                    >
                      <img src="/logo.png" alt="Logo" className="w-14" />
                      <div>
                        <p className="text-lg font-bold capitalize">
                          {t.site.name}
                        </p>
                        <p className="bg-primary-300 mx-auto w-fit rounded-md px-2 py-1 text-[8px] leading-normal text-white">
                          {t.site.tagline}
                        </p>
                      </div>
                    </NavLink>
                  </div>
                  <div className="w-full max-w-3xl space-y-2">
                    <DesktopRegionFilter
                      options={props.allRegions}
                      selectedItems={props.selectedRegions}
                      setSelectedItems={props.setSelectedRegions}
                      isRTL={props.isRTL}
                      isDesktopView={props.isDesktopView}
                      isOpen={props.showDropdown === "area"}
                      onToggle={() => props.toggleDropdown("area")}
                      placeholder={t.search.areaPlaceholder}
                      searchPlaceholder={t.search.searchPlaceholder}
                    />
                    <div className="flex flex-wrap items-center justify-start gap-2">
                      <CategoryFilter
                        options={props.transactionTypes}
                        selectedValue={props.transactionType}
                        setSelectedValue={props.setTransactionType}
                        label={t.search.transactionType}
                        isOpen={props.showDropdown === "transactionType"}
                        onToggle={() => props.toggleDropdown("transactionType")}
                        isMobile={isMobile}
                        isRTL={props.isRTL}
                      />
                      <PropertyDropdown
                        options={props.allPropertyTypes}
                        selectedItems={props.selectedPropertyTypes}
                        setSelectedItems={props.setSelectedPropertyTypes}
                        placeholder={t.search.propertyType}
                        searchPlaceholder={t.search.searchPlaceholder}
                        isOpen={props.showDropdown === "propertyTypes"}
                        onToggle={() => props.toggleDropdown("propertyTypes")}
                        isMobile={isMobile}
                        isRTL={props.isRTL}
                      />
                      <PriceRangeFilter
                        minPrice={props.minPrice}
                        maxPrice={props.maxPrice}
                        setMinPrice={props.setMinPrice}
                        setMaxPrice={props.setMaxPrice}
                        t={props.t}
                        isRTL={props.isRTL}
                        onApply={props.onApply}
                        isOpen={props.showDropdown === "price"}
                        onToggle={() => props.toggleDropdown("price")}
                        isMobile={isMobile}
                      />
                      <TextSearchFilter
                        searchTerm={props.searchText}
                        setSearchTerm={props.setSearchText}
                        t={props.t}
                        isRTL={props.isRTL}
                        onApply={props.onApply}
                        isOpen={props.showDropdown === "text"}
                        onToggle={() => props.toggleDropdown("text")}
                        isMobile={isMobile}
                      />
                    </div>
                  </div>
                </div>
              )}
              {isMobile && (
                <div className="flex flex-col gap-3">
                  {props.selectedRegions.length === 0 ? (
                    // STATE 1: No items selected - UPDATED CODE FOR THIS SECTION
                    <div
                      onClick={() => props.toggleDropdown("area")}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-300 p-2"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSidebar();
                        }}
                        className="text-2xl text-gray-500"
                      >
                        <FaBars />
                      </button>
                      <span className="flex-grow text-left font-bold text-gray-600">
                        {t.search.areaPlaceholder}
                      </span>

                      <Link
                        to="/"
                        className="h-10 w-10 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src="/logo.png"
                          alt="Logo"
                          className="h-full w-full rounded-md object-cover"
                        />
                      </Link>
                    </div>
                  ) : (
                    // STATE 2: Items are selected (no changes here as per request)
                    <div>
                      <div className="flex items-center gap-3 rounded-lg border-1 border-gray-300 p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSidebar();
                          }}
                          className="text-3xl text-gray-700"
                        >
                          <FaBars />
                        </button>
                        <ScrollableTags
                          items={props.selectedRegions}
                          onRemoveItem={(item) => {
                            props.setSelectedRegions((prev) =>
                              prev.filter(
                                (selected) => selected.id !== item.id,
                              ),
                            );
                          }}
                          isRTL={isRTL}
                        />
                        <Link
                          to="/"
                          className="h-10 w-10 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-full w-full rounded-md object-cover"
                          />
                        </Link>
                      </div>
                      <div
                        onClick={() => props.toggleDropdown("area")}
                        className="mt-2 w-full cursor-pointer rounded-lg border border-gray-300 p-2 text-center text-sm text-gray-400"
                      >
                        {t.search.areaPlaceholder}
                      </div>
                    </div>
                  )}

                  {/* MobileRegionFilter and HorizontalScroller parts below remain unchanged */}
                  <MobileRegionFilter
                    options={props.allRegions}
                    selectedItems={props.selectedRegions}
                    setSelectedItems={props.setSelectedRegions}
                    isOpen={props.showDropdown === "area"}
                    onToggle={() => props.toggleDropdown("area")}
                    placeholder={t.search.areaPlaceholder}
                    searchPlaceholder={t.search.searchPlaceholder}
                  />

                  <div>
                    <HorizontalScroller>
                      <CategoryFilter
                        options={props.transactionTypes}
                        selectedValue={props.transactionType}
                        setSelectedValue={props.setTransactionType}
                        label={t.search.transactionType}
                        isOpen={props.showDropdown === "transactionType"}
                        onToggle={() => props.toggleDropdown("transactionType")}
                        isMobile={isMobile}
                        isRTL={props.isRTL}
                      />
                      <PropertyDropdown
                        options={props.allPropertyTypes}
                        selectedItems={props.selectedPropertyTypes}
                        setSelectedItems={props.setSelectedPropertyTypes}
                        placeholder={t.search.propertyType}
                        searchPlaceholder={t.search.searchPlaceholder}
                        isOpen={props.showDropdown === "propertyTypes"}
                        onToggle={() => props.toggleDropdown("propertyTypes")}
                        isMobile={isMobile}
                        isRTL={props.isRTL}
                      />
                      <PriceRangeFilter
                        minPrice={props.minPrice}
                        maxPrice={props.maxPrice}
                        setMinPrice={props.setMinPrice}
                        setMaxPrice={props.setMaxPrice}
                        t={props.t}
                        isRTL={props.isRTL}
                        onApply={props.onApply}
                        isOpen={props.showDropdown === "price"}
                        onToggle={() => props.toggleDropdown("price")}
                        isMobile={isMobile}
                      />
                      <TextSearchFilter
                        searchTerm={props.searchText}
                        setSearchTerm={props.setSearchText}
                        t={props.t}
                        isRTL={props.isRTL}
                        onApply={props.onApply}
                        isOpen={props.showDropdown === "text"}
                        onToggle={() => props.toggleDropdown("text")}
                        isMobile={isMobile}
                      />
                    </HorizontalScroller>
                  </div>
                </div>
              )}
            </div>
          )}
        </SearchFilterBar>
      </nav>
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {isMobile && !sidebarOpen && <FabController />}
    </>
  );
}
