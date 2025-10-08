import { useState, useRef, useEffect } from "react";
import { LuChevronDown, LuSearch, LuX } from "react-icons/lu";
import { useLanguage } from "../../context/LanguageContext";

export const MultiSelectDropdown = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder,
  searchPlaceholder,
  isRTL,
  isOpen,
  onToggle,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          onToggle();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, { ...item }],
    );
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <div
        className={`flex w-full cursor-pointer items-center justify-between rounded-full border border-gray-300 bg-white px-3 py-3 focus-within:ring-1 focus-within:ring-gray-200 ${isOpen ? "ring-primary-600 ring-1" : ""}`}
        onClick={onToggle}
        role="button"
        tabIndex="0"
      >
        <div
          className={`flex-grow px-2 text-gray-500 ${isRTL ? "text-right" : "text-left"} flex min-h-[24px] flex-wrap items-center gap-1`}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <span
                key={item.id}
                className="flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium"
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
                  <LuX size={12} />
                </button>
              </span>
            ))
          ) : (
            // --- THIS LINE IS NOW CORRECTED ---
            <p className="text-md text-gray-500 lg:text-lg lg:font-[400]">
              {placeholder}
            </p>
          )}
        </div>
        <span
          className={`text-primary-600 text-xl transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <LuChevronDown />
        </span>
      </div>

      {isOpen && (
        <div className="absolute mt-1 max-h-80 w-full cursor-pointer overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {/* <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-gray-300 p-2 text-left focus:ring-1 focus:ring-gray-300 focus:outline-none"
              dir="ltr"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div> */}
          <ul className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 text-sm font-[700] font-medium text-gray-500 hover:bg-gray-100"
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
                    <span className={`ml-2 px-2 text-left`} dir="ltr">
                      {option.name}
                    </span>
                  </div>
                  {option.count !== undefined && option.count !== null && (
                    <span className="px-4 text-sm text-gray-700">
                      ({option.count})
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-800">
                {t.search.noResultsFound}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export const OnlyMultiSelectDropdown = ({
  options,
  selectedItems,
  setSelectedItems,
  placeholder,
  searchPlaceholder,
  isRTL,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          onToggle();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.some((selected) => selected.id === item.id)
        ? prev.filter((selected) => selected.id !== item.id)
        : [...prev, { ...item }],
    );
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <div
        className={`flex w-full items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-left font-medium text-nowrap text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none ${isRTL ? "flex-row-reverse" : ""}`}
        onClick={onToggle}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <span className="text-sm font-bold">{placeholder}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <LuChevronDown />
        </span>
      </div>

      {isOpen && (
        <div className="absolute mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`w-full rounded-lg border border-gray-300 p-2 focus:ring-1 focus:ring-gray-300 focus:outline-none ${isRTL ? "text-right" : "text-left"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ul className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(option);
                  }}
                >
                  <div
                    className={`flex items-center ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <input
                      type="checkbox"
                      readOnly
                      checked={selectedItems.some(
                        (item) => item.id === option.id,
                      )}
                      className="form-checkbox h-4 w-4 cursor-pointer rounded"
                    />
                    <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                      {option.name}
                    </span>
                  </div>
                  {option.count && (
                    <span className="text-sm">({option.count})</span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-800">
                {t.search.noResultsFound}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export const SingleSelectDropdown = ({
  options,
  selectedValue,
  setSelectedValue,
  placeholder,
  label,
  isRTL,
  isOpen,
  onToggle,
  hasSearch = false,
  searchPlaceholder,
}) => {
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) {
          onToggle();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setSearchTerm("");
    onToggle();
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        type="button"
        className={`flex w-full items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-nowrap text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none ${isRTL ? "flex-row-reverse" : ""}`}
        onClick={onToggle}
      >
        <span>{label}</span>
        <span
          className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <LuChevronDown size={16} />
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 mt-2 max-h-60 w-fit min-w-44 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg ${isRTL ? "left-0" : "right-0"}`}
        >
          {hasSearch && (
            <div className="border-b border-gray-200 p-2">
              <input
                type="text"
                placeholder={searchPlaceholder || "Search..."}
                className={`w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-gray-300 ${isRTL ? "text-right" : "text-left"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <ul className="p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center rounded-md p-2 text-gray-800 ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => handleSelect(option.id)}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={selectedValue === option.id}
                    className="form-radio h-4 w-4 cursor-pointer"
                  />
                  <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                    {option.name}
                  </span>
                </li>
              ))
            ) : (
              <li className="p-2 text-center text-gray-500">
                {t.search.noResultsFound}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

//=================================//8-27-205

// import { useState, useRef, useEffect } from "react";
// import { LuChevronDown, LuSearch, LuX } from "react-icons/lu";
// import { useLanguage } from "../../context/LanguageContext";

// export const MultiSelectDropdown = ({
//   options,
//   selectedItems,
//   setSelectedItems,
//   placeholder,
//   searchPlaceholder,
//   isRTL,
//   isOpen,
//   onToggle,
// }) => {
//   const { t } = useLanguage();
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (isOpen) {
//           onToggle();
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onToggle]);

//   const toggleItem = (item) => {
//     setSelectedItems((prev) =>
//       prev.some((selected) => selected.id === item.id)
//         ? prev.filter((selected) => selected.id !== item.id)
//         : [...prev, { ...item }],
//     );
//   };

//   const filteredOptions = options.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="relative w-full sm:w-auto" ref={dropdownRef}>
//       <div
//         className={`flex w-24 cursor-pointer items-center justify-between rounded-full border border-gray-300 bg-white p-1 focus-within:ring-1 focus-within:ring-gray-200 lg:w-full ${isOpen ? "ring-1 ring-gray-300" : ""}`}
//         onClick={onToggle}
//         role="button"
//         tabIndex="0"
//       >
//         <div
//           className={`flex-grow px-2 text-gray-500 ${isRTL ? "text-right" : "text-left"} flex min-h-[24px] flex-wrap items-center gap-1`}
//         >
//           {selectedItems.length > 0 ? (
//             selectedItems.map((item) => (
//               <span
//                 key={item.id}
//                 className="flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium"
//               >
//                 {item.name}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleItem(item);
//                   }}
//                   className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
//                 >
//                   <LuX size={12} />
//                 </button>
//               </span>
//             ))
//           ) : (
//             <h4 className="text-xs font-[600] text-gray-600 lg:text-lg lg:font-[400]">
//               {placeholder}
//             </h4>
//           )}
//         </div>
//         <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
//           <LuChevronDown />
//         </span>
//       </div>

//       {isOpen && (
//         <div className="absolute z-20 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
//           <div className="p-2">
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               className="w-full rounded-lg border border-gray-300 p-2 text-left focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               dir="ltr"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           <ul className="p-1">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <li
//                   key={option.id}
//                   className="my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleItem(option);
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       readOnly
//                       checked={selectedItems.some(
//                         (item) => item.id === option.id,
//                       )}
//                       className="form-checkbox h-4 w-4 cursor-pointer rounded"
//                     />
//                     <span className={`ml-2 px-2 text-left`} dir="ltr">
//                       {option.name}
//                     </span>
//                   </div>
//                   {/* This is the updated part */}
//                   {option.properties_count !== undefined &&
//                     option.properties_count !== null && (
//                       <span className="px-4 text-sm text-gray-700">
//                         ({option.properties_count})
//                       </span>
//                     )}
//                 </li>
//               ))
//             ) : (
//               <li className="p-2 text-center text-gray-800">
//                 {t.search.noResultsFound}
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export const OnlyMultiSelectDropdown = ({
//   options,
//   selectedItems,
//   setSelectedItems,
//   placeholder,
//   searchPlaceholder,
//   isRTL,
//   isOpen,
//   onToggle,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const dropdownRef = useRef(null);
//   const { t } = useLanguage();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (isOpen) {
//           onToggle();
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onToggle]);

//   const toggleItem = (item) => {
//     setSelectedItems((prev) =>
//       prev.some((selected) => selected.id === item.id)
//         ? prev.filter((selected) => selected.id !== item.id)
//         : [...prev, { ...item }],
//     );
//   };

//   const filteredOptions = options.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="relative w-full sm:w-auto" ref={dropdownRef}>
//       <div
//         className={`flex w-full items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-left font-medium text-nowrap text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none ${isRTL ? "flex-row-reverse" : ""}`}
//         onClick={onToggle}
//         role="button"
//         tabIndex="0"
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             onToggle();
//           }
//         }}
//       >
//         <span className="text-sm font-bold">{placeholder}</span>
//         <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
//           <LuChevronDown />
//         </span>
//       </div>

//       {isOpen && (
//         <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
//           <div className="p-2">
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               className={`w-full rounded-lg border border-gray-300 p-2 focus:ring-1 focus:ring-gray-300 focus:outline-none ${isRTL ? "text-right" : "text-left"}`}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>
//           <ul className="p-1">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <li
//                   key={option.id}
//                   className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 ${isRTL ? "flex-row-reverse" : ""}`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleItem(option);
//                   }}
//                 >
//                   <div
//                     className={`flex items-center ${isRTL ? "text-right" : "text-left"}`}
//                   >
//                     <input
//                       type="checkbox"
//                       readOnly
//                       checked={selectedItems.some(
//                         (item) => item.id === option.id,
//                       )}
//                       className="form-checkbox h-4 w-4 cursor-pointer rounded"
//                     />
//                     <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
//                       {option.name}
//                     </span>
//                   </div>
//                   {option.count && (
//                     <span className="text-sm">({option.count})</span>
//                   )}
//                 </li>
//               ))
//             ) : (
//               <li className="p-2 text-center text-gray-800">
//                 {t.search.noResultsFound}
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export const SingleSelectDropdown = ({
//   options,
//   selectedValue,
//   setSelectedValue,
//   placeholder,
//   label,
//   isRTL,
//   isOpen,
//   onToggle,
//   hasSearch = false,
//   searchPlaceholder,
// }) => {
//   const dropdownRef = useRef(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const { t } = useLanguage();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         if (isOpen) {
//           onToggle();
//         }
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isOpen, onToggle]);

//   const handleSelect = (value) => {
//     setSelectedValue(value);
//     setSearchTerm("");
//     onToggle();
//   };

//   const filteredOptions = options.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="relative w-full sm:w-auto" ref={dropdownRef}>
//       <button
//         type="button"
//         className={`flex w-full items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-nowrap text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:outline-none ${isRTL ? "flex-row-reverse" : ""}`}
//         onClick={onToggle}
//       >
//         <span>{label}</span>
//         <span
//           className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
//         >
//           <LuChevronDown size={16} />
//         </span>
//       </button>

//       {isOpen && (
//         <div
//           className={`absolute z-20 mt-2 max-h-60 w-fit min-w-44 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg ${isRTL ? "left-0" : "right-0"}`}
//         >
//           {hasSearch && (
//             <div className="border-b border-gray-200 p-2">
//               <input
//                 type="text"
//                 placeholder={searchPlaceholder || "Search..."}
//                 className={`w-full rounded-lg border border-gray-300 p-2 text-sm focus:ring-gray-300 ${isRTL ? "text-right" : "text-left"}`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           )}
//           <ul className="p-1">
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((option) => (
//                 <li
//                   key={option.id}
//                   className={`hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center rounded-md p-2 text-gray-800 ${isRTL ? "flex-row-reverse" : ""}`}
//                   onClick={() => handleSelect(option.id)}
//                 >
//                   <input
//                     type="radio"
//                     readOnly
//                     checked={selectedValue === option.id}
//                     className="form-radio h-4 w-4 cursor-pointer"
//                   />
//                   <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
//                     {option.name}
//                   </span>
//                 </li>
//               ))
//             ) : (
//               <li className="p-2 text-center text-gray-500">
//                 {t.search.noResultsFound}
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
