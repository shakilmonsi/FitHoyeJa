// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ButtonSubmit from "../../common/button/ButtonSubmit";
// import { LuSearch, LuX } from "react-icons/lu";
// import { FaArrowLeft } from "react-icons/fa";
// import { useLanguage } from "../../context/LanguageContext";
// import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
// import axios from "../../utils/axiosInstance";

// export default function Hero() {
//   const { t, isRTL, currentRegionData } = useLanguage();

//   return (
//     <section>
//       {/* <div className="absolute right-0 bottom-0 left-0 -z-1 w-full">
//         <img
//           alt={t.site.name}
//           width="1920"
//           height="426"
//           className="hidden h-auto w-full object-cover lg:block"
//           src="/home-hero-desktop-hd.svg"
//         />
//         <img
//           alt={t.site.name}
//           width="1920"
//           height="426"
//           className="max-w-screen-[200px] h-auto w-full object-cover lg:hidden"
//           src="/home-hero-mobile-hd.svg"
//         />
//       </div> */}

//       <div className="container mx-auto mt-6 flex h-full w-full items-start justify-center p-4 lg:mt-20">
//         <div className="flex w-full max-w-2xl flex-col items-center text-center">
//           <div className="px-4 sm:px-8">
//             <h1 className="mb-3 text-lg font-[700] text-black md:text-xl lg:text-[26px]">
//               {t.home.bannerTitle}
//             </h1>
//             <p className="mb-8 text-[14px] font-normal text-[#556885] md:text-[14x]">
//               {t.home.bannerSubTitle}
//             </p>
//           </div>
//           <div className="shadow-primary-900/30 w-full max-w-md rounded-2xl px-4 sm:p-6 lg:-mt-3">
//             <FilterComponent
//               t={t}
//               isRTL={isRTL}
//               regionsData={currentRegionData}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function FilterComponent({ t, isRTL, regionsData }) {
//   const navigate = useNavigate();
//   const { language, currentTransactionTypesData } = useLanguage();

//   const [selectedOption, setSelectedOption] = useState("rent");
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
//   const [propertyTypeData, setPropertyTypeData] = useState([]);

//   const [showDropdown, setShowDropdown] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   useEffect(() => {
//     const fetchPropertyTypes = async () => {
//       try {
//         const url =
//           language === "ar"
//             ? "/propertyTypesArbic.json"
//             : "/propertyTypes.json";
//         const response = await fetch(url);
//         const data = await response.json();
//         setPropertyTypeData(data);
//       } catch (error) {
//         console.error("Error fetching property types data:", error);
//       }
//     };

//     fetchPropertyTypes();
//   }, [language]);

//   useEffect(() => {
//     if (currentTransactionTypesData && currentTransactionTypesData.length > 0) {
//       setSelectedOption(currentTransactionTypesData[0]?.id || "rent");
//     }
//   }, [currentTransactionTypesData]);

//   const toggleDropdown = (dropdownName) => {
//     setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const toggleModalDropdown = (dropdownName) => {
//     setShowDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const params = new URLSearchParams();

//     if (selectedOption) {
//       params.set("transactionType", selectedOption);
//     }

//     selectedRegions.forEach((region) => {
//       if (region.id && region.id !== "all") {
//         params.append("region", region.id);
//       }
//     });

//     selectedPropertyTypes.forEach((type) => {
//       if (type.id && type.id !== "all") {
//         params.append("propertyType", type.id);
//       }
//     });

//     navigate(`/search?${params.toString()}`);
//   };

//   return (
//     <form onSubmit={handleSearch} className="space-y-4">
//       <span className="hidden text-[#556885] xl:block">
//         <MultiSelectDropdown
//           options={regionsData}
//           selectedItems={selectedRegions}
//           setSelectedItems={setSelectedRegions}
//           placeholder={t.home.typeAreaPlaceholder}
//           searchPlaceholder={t.home.searchPlaceholder}
//           isRTL={isRTL}
//           isOpen={openDropdown === "regions"}
//           onToggle={() => toggleDropdown("regions")}
//         />
//       </span>
//       <span className="xl:hidden">
//         <MobileRegionFilter
//           options={regionsData}
//           selectedItems={selectedRegions}
//           setSelectedItems={setSelectedRegions}
//           placeholder={t.home.typeAreaPlaceholder}
//           searchPlaceholder={t.home.searchPlaceholder}
//           label={t.home.searchPlaceholder}
//           isOpen={showDropdown === "search"}
//           onToggle={() => toggleModalDropdown("search")}
//         />
//       </span>

//       <MultiSelectDropdown
//         options={propertyTypeData}
//         selectedItems={selectedPropertyTypes}
//         setSelectedItems={setSelectedPropertyTypes}
//         placeholder={t.home.propertyTypePlaceholder}
//         searchPlaceholder={t.home.searchPlaceholder}
//         isRTL={isRTL}
//         isOpen={openDropdown === "propertyTypes"}
//         onToggle={() => toggleDropdown("propertyTypes")}
//       />
//       <div className="flex justify-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
//         {currentTransactionTypesData.map((option) => (
//           <button
//             key={option.id}
//             type="button"
//             className={`flex-1 rounded-full px-2 py-2 text-[15px] font-[700] text-[#556885] transition-colors duration-300 ease-in-out ${
//               selectedOption === option.id
//                 ? "bg-[#F78A6F] text-white"
//                 : "text-primary-900 hover:bg-primary-300/20 bg-transparent"
//             }`}
//             onClick={() => setSelectedOption(option.id)}
//           >
//             {option.name}
//           </button>
//         ))}
//       </div>

//       <ButtonSubmit
//         text={
//           <span className="flex items-center gap-2 text-[16px] font-[700]">
//             {t.home.searchButton}
//           </span>
//         }
//         className="!w-full rounded-4xl"
//       />
//     </form>
//   );
// }

// const MobileRegionFilter = ({
//   options,
//   selectedItems,
//   setSelectedItems,
//   placeholder,
//   searchPlaceholder,
//   isOpen,
//   onToggle,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const { isRTL, t } = useLanguage();

//   const toggleItem = (item) => {
//     setSelectedItems((prev) =>
//       prev.some((selected) => selected.id === item.id)
//         ? prev.filter((selected) => selected.id !== item.id)
//         : [...prev, item],
//     );
//   };

//   const handleItemSelect = (item, e) => {
//     e.stopPropagation();
//     toggleItem(item);
//     onToggle();
//   };

//   const filteredOptions = options.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <>
//       <div onClick={onToggle} className="mb-5 cursor-pointer">
//         <div
//           className={`flex w-full cursor-pointer flex-wrap items-center gap-2 rounded-3xl border border-gray-200 bg-white px-3 py-3 focus-within:ring-1 focus-within:ring-gray-200 ${
//             isOpen ? "ring-primary-600 ring-1" : ""
//           }`}
//         >
//           <div>
//             {selectedItems.length > 0 ? (
//               selectedItems.map((item) => (
//                 <span
//                   key={item.id}
//                   className="bg-primary-300/20 flex items-center rounded-md px-2 py-1 text-xs font-medium text-black"
//                 >
//                   {item.name}
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleItem(item);
//                     }}
//                     className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
//                   >
//                     <LuX />
//                   </button>
//                 </span>
//               ))
//             ) : (
//               <p className="text-md text-gray-500 lg:text-lg lg:font-[400]">
//                 {placeholder}
//               </p>
//             )}
//           </div>
//           <span className="text-primary-600 pr-34 text-xl lg:pr-46">
//             <LuSearch />
//           </span>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 z-[999] bg-white">
//           <div className="flex h-full flex-col overflow-y-auto">
//             {selectedItems.length > 0 && (
//               <div className="shrink-0 px-4 pt-4">
//                 <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 p-2">
//                   {selectedItems.map((item) => (
//                     <span
//                       key={item.id}
//                       className="bg-primary-300/20 flex items-center rounded-md px-2 py-1 text-xs font-medium text-black"
//                     >
//                       {item.name}
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleItem(item);
//                         }}
//                         className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
//                       >
//                         <LuX />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="shrink-0 p-4">
//               <div
//                 className={`border-primary-600 focus-within:ring-primary-300 relative flex w-full items-center rounded-md border p-2 focus-within:ring-1 ${
//                   isRTL ? "pr-14" : "pl-14"
//                 }`}
//               >
//                 <span
//                   onClick={onToggle}
//                   className={`text-primary-600 absolute inset-y-0 flex cursor-pointer items-center text-2xl ${
//                     isRTL ? "right-3" : "left-3"
//                   }`}
//                 >
//                   <FaArrowLeft />
//                 </span>
//                 <input
//                   type="text"
//                   placeholder={searchPlaceholder}
//                   className="w-full rounded-lg border border-gray-300 p-2 text-left focus:outline-none"
//                   dir="ltr"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               </div>
//             </div>

//             <ul className="flex-1 overflow-y-auto p-1">
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((option) => (
//                   <li
//                     key={option.id}
//                     className="hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 text-[14px] font-[700] text-[#556885]"
//                     onClick={(e) => handleItemSelect(option, e)}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         readOnly
//                         checked={selectedItems.some(
//                           (item) => item.id === option.id,
//                         )}
//                         className="form-radio h-4 w-4 cursor-pointer rounded"
//                       />
//                       <span
//                         className={`px-2 ${isRTL ? "mr-2" : "ml-2"} ${
//                           isRTL ? "text-right" : "text-left"
//                         }`}
//                         dir={isRTL ? "rtl" : "ltr"}
//                       >
//                         {option.name}
//                       </span>
//                     </div>

//                     {option.count !== undefined && option.count !== null && (
//                       <span className="px-4 text-sm text-gray-700">
//                         ({option.count})
//                       </span>
//                     )}
//                   </li>
//                 ))
//               ) : (
//                 <li className="p-2 text-center text-gray-800">
//                   {t.search.noResultsFound}
//                 </li>
//               )}
//             </ul>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

//====================================================//todays 1

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import ButtonSubmit from "../../common/button/ButtonSubmit";
// import { LuSearch, LuX } from "react-icons/lu";
// import { FaArrowLeft } from "react-icons/fa";
// import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
// import { useLanguage } from "../../context/LanguageContext";

// export default function Hero() {
//   const { t, isRTL, currentRegionData } = useLanguage();

//   return (
//     <section>
//       {/* <div className="absolute right-0 bottom-0 left-0 -z-1 w-full">
//  <img
//  alt={t.site.name}
//   width="1920"
//   height="426"
//   className="hidden h-auto w-full object-cover lg:block"
//   src="/home-hero-desktop-hd.svg"
//  />
//  <img
//   alt={t.site.name}
//   width="1920"
//   height="426"
//   className="max-w-screen-[200px] h-auto w-full object-cover lg:hidden"
//   src="/home-hero-mobile-hd.svg"
//  / </div> */}

//       <div className="container mx-auto mt-6 flex h-full w-full items-start justify-center p-4 lg:mt-20">
//         <div className="flex w-full max-w-2xl flex-col items-center text-center">
//           <div className="px-4 sm:px-8">
//             <h1 className="mb-3 text-lg font-[700] text-black md:text-xl lg:text-[26px]">
//               {t.home.bannerTitle}
//             </h1>
//             <p className="mb-8 text-[14px] font-normal text-[#556885] md:text-[14x]">
//               {t.home.bannerSubTitle}
//             </p>
//           </div>
//           <div className="shadow-primary-900/30 w-full max-w-md rounded-2xl px-4 sm:p-6 lg:-mt-3">
//             <FilterComponent
//               t={t}
//               isRTL={isRTL}
//               regionsData={currentRegionData}
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function FilterComponent({ t, isRTL, regionsData }) {
//   const navigate = useNavigate();
//   const { language, currentTransactionTypesData, currentPropertyTypesData } =
//     useLanguage();

//   const [selectedOption, setSelectedOption] = useState("rent");
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);

//   const [showDropdown, setShowDropdown] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   useEffect(() => {
//     if (currentTransactionTypesData && currentTransactionTypesData.length > 0) {
//       setSelectedOption(currentTransactionTypesData[0]?.id || "rent");
//     }
//   }, [currentTransactionTypesData]);

//   const toggleDropdown = (dropdownName) => {
//     setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const toggleModalDropdown = (dropdownName) => {
//     setShowDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     const params = new URLSearchParams();

//     if (selectedOption) {
//       params.set("transactionType", selectedOption);
//     }

//     selectedRegions.forEach((region) => {
//       if (region.id && region.id !== "all") {
//         params.append("region", region.id);
//       }
//     });

//     selectedPropertyTypes.forEach((type) => {
//       if (type.id && type.id !== "all") {
//         params.append("propertyType", type.id);
//       }
//     });

//     navigate(`/search?${params.toString()}`);
//   };

//   return (
//     <form onSubmit={handleSearch} className="space-y-4">
//       <span className="hidden text-[#556885] xl:block">
//         <MultiSelectDropdown
//           options={regionsData || []}
//           selectedItems={selectedRegions}
//           setSelectedItems={setSelectedRegions}
//           placeholder={t.home.typeAreaPlaceholder}
//           searchPlaceholder={t.home.searchPlaceholder}
//           isRTL={isRTL}
//           isOpen={openDropdown === "regions"}
//           onToggle={() => toggleDropdown("regions")}
//         />
//       </span>
//       <span className="xl:hidden">
//         <MobileRegionFilter
//           options={regionsData || []}
//           selectedItems={selectedRegions}
//           setSelectedItems={setSelectedRegions}
//           placeholder={t.home.typeAreaPlaceholder}
//           searchPlaceholder={t.home.searchPlaceholder}
//           label={t.home.searchPlaceholder}
//           isOpen={showDropdown === "search"}
//           onToggle={() => toggleModalDropdown("search")}
//         />
//       </span>

//       <MultiSelectDropdown
//         options={currentPropertyTypesData || []}
//         selectedItems={selectedPropertyTypes}
//         setSelectedItems={setSelectedPropertyTypes}
//         placeholder={t.home.propertyTypePlaceholder}
//         searchPlaceholder={t.home.searchPlaceholder}
//         isRTL={isRTL}
//         isOpen={openDropdown === "propertyTypes"}
//         onToggle={() => toggleDropdown("propertyTypes")}
//       />
//       <div className="flex justify-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
//         {currentTransactionTypesData &&
//           currentTransactionTypesData.map((option) => (
//             <button
//               key={option.id}
//               type="button"
//               className={`flex-1 rounded-full px-2 py-2 text-[15px] font-[700] text-[#556885] transition-colors duration-300 ease-in-out ${
//                 selectedOption === option.id
//                   ? "bg-[#F78A6F] text-white"
//                   : "text-primary-900 hover:bg-primary-300/20 bg-transparent"
//               }`}
//               onClick={() => setSelectedOption(option.id)}
//             >
//               {option.name}
//             </button>
//           ))}
//       </div>

//       <ButtonSubmit
//         text={
//           <span className="flex items-center justify-center gap-2 text-[16px] font-[700]">
//             {t.home.searchButton}
//           </span>
//         }
//         className="!w-full rounded-4xl"
//       />
//     </form>
//   );
// }

// const MobileRegionFilter = ({
//   options,
//   selectedItems,
//   setSelectedItems,
//   placeholder,
//   searchPlaceholder,
//   isOpen,
//   onToggle,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const { isRTL, t } = useLanguage();

//   const toggleItem = (item) => {
//     setSelectedItems((prev) =>
//       prev.some((selected) => selected.id === item.id)
//         ? prev.filter((selected) => selected.id !== item.id)
//         : [...prev, item],
//     );
//   };

//   const handleItemSelect = (item, e) => {
//     e.stopPropagation();
//     toggleItem(item);
//   };

//   const filteredOptions = (options || []).filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <>
//       <div onClick={onToggle} className="mb-5 cursor-pointer">
//         <div
//           className={`flex w-full cursor-pointer flex-wrap items-center justify-between gap-2 rounded-3xl border border-gray-200 bg-white px-3 py-3 focus-within:ring-1 focus-within:ring-gray-200 ${
//             isOpen ? "ring-primary-600 ring-1" : ""
//           }`}
//         >
//           <div className="flex flex-wrap gap-1">
//             {selectedItems.length > 0 ? (
//               selectedItems.map((item) => (
//                 <span
//                   key={item.id}
//                   className="bg-primary-300/20 flex items-center rounded-md px-2 py-1 text-xs font-medium text-black"
//                 >
//                   {item.name}
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleItem(item);
//                     }}
//                     className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
//                   >
//                     <LuX />
//                   </button>
//                 </span>
//               ))
//             ) : (
//               <p className="text-md text-gray-500 lg:text-lg lg:font-[400]">
//                 {placeholder}
//               </p>
//             )}
//           </div>
//           <span className="text-primary-600 text-xl">
//             <LuSearch />
//           </span>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 z-[999] bg-white">
//           <div className="flex h-full flex-col overflow-y-auto">
//             <div className="flex items-center justify-between border-b p-4">
//               <button onClick={onToggle} className="-ml-2 p-2 text-2xl">
//                 <FaArrowLeft />
//               </button>
//               <h2 className="text-lg font-bold">Select Location</h2>
//               <span className="w-8"></span>
//             </div>

//             <div className="p-4">
//               <input
//                 type="text"
//                 placeholder={searchPlaceholder}
//                 className="w-full rounded-lg border border-gray-300 p-2 text-left focus:outline-none"
//                 dir="ltr"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {selectedItems.length > 0 && (
//               <div className="px-4 pb-2">
//                 <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 p-2">
//                   {selectedItems.map((item) => (
//                     <span
//                       key={item.id}
//                       className="bg-primary-300/20 flex items-center rounded-md px-2 py-1 text-xs font-medium text-black"
//                     >
//                       {item.name}
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleItem(item);
//                         }}
//                         className={`${isRTL ? "mr-1" : "ml-1"} hover:text-red-500`}
//                       >
//                         <LuX />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <ul className="flex-1 overflow-y-auto p-1">
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((option) => (
//                   <li
//                     key={option.id}
//                     className="hover:bg-primary-300/20 my-0.5 flex cursor-pointer items-center justify-between rounded-md p-2 text-[14px] font-[700] text-[#556885]"
//                     onClick={(e) => handleItemSelect(option, e)}
//                   >
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         readOnly
//                         checked={selectedItems.some(
//                           (item) => item.id === option.id,
//                         )}
//                         className="form-radio h-4 w-4 cursor-pointer rounded"
//                       />
//                       <span
//                         className={`px-2 ${isRTL ? "mr-2" : "ml-2"} ${
//                           isRTL ? "text-right" : "text-left"
//                         }`}
//                         dir={isRTL ? "rtl" : "ltr"}
//                       >
//                         {option.name}
//                       </span>
//                     </div>

//                     {option.count !== undefined && option.count !== null && (
//                       <span className="px-4 text-sm text-gray-700">
//                         ({option.count})
//                       </span>
//                     )}
//                   </li>
//                 ))
//               ) : (
//                 <li className="p-2 text-center text-gray-800">
//                   {t.search.noResultsFound}
//                 </li>
//               )}
//             </ul>
//             <div className="border-t p-4">
//               <button
//                 onClick={onToggle}
//                 className="w-full rounded-full bg-[#F78A6F] p-3 font-bold text-white"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

//=============================================================//today -2

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { LuSearch, LuX } from "react-icons/lu";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero() {
  const { t, isRTL, currentRegionData } = useLanguage();

  return (
    <section>
      {/* Your background images are commented out as in your original code */}
      {/* <div className="absolute right-0 bottom-0 left-0 -z-1 w-full"> ... </div> */}

      <div className="container mx-auto mt-6 flex h-full w-full items-start justify-center p-4 lg:mt-20">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <div className="px-4 sm:px-8">
            <h1 className="mb-3 text-lg font-[700] text-black md:text-xl lg:text-[26px]">
              {t.home.bannerTitle}
            </h1>
            <p className="mb-8 text-[14px] font-normal text-[#556885] md:text-[14px]">
              {t.home.bannerSubTitle}
            </p>
          </div>
          <div className="w-full max-w-md rounded-2xl px-4 sm:p-6 lg:-mt-3">
            <FilterComponent
              t={t}
              isRTL={isRTL}
              regionsData={currentRegionData}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterComponent({ t, isRTL, regionsData }) {
  const navigate = useNavigate();
  const { language, currentTransactionTypesData, currentPropertyTypesData } =
    useLanguage();

  const [selectedOption, setSelectedOption] = useState("rent");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (currentTransactionTypesData && currentTransactionTypesData.length > 0) {
      setSelectedOption(currentTransactionTypesData[0]?.id || "rent");
    }
  }, [currentTransactionTypesData]);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const toggleModalDropdown = (dropdownName) => {
    setShowDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (selectedOption) {
      params.set("transactionType", selectedOption);
    }

    selectedRegions.forEach((region) => {
      if (region.id && region.id !== "all") {
        params.append("region", region.id);
      }
    });

    selectedPropertyTypes.forEach((type) => {
      if (type.id && type.id !== "all") {
        params.append("propertyType", type.id);
      }
    });

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* This component is now updated to match your new design */}
      <MobileRegionFilter
        options={regionsData || []}
        selectedItems={selectedRegions}
        setSelectedItems={setSelectedRegions}
        placeholder={t.home.typeAreaPlaceholder}
        searchPlaceholder={t.home.searchPlaceholder}
        label={t.home.searchPlaceholder}
        isOpen={showDropdown === "search"}
        onToggle={() => toggleModalDropdown("search")}
      />

      {/* This is the second dropdown for property types */}
      <MultiSelectDropdown
        options={currentPropertyTypesData || []}
        selectedItems={selectedPropertyTypes}
        setSelectedItems={setSelectedPropertyTypes}
        placeholder={t.home.propertyTypePlaceholder}
        searchPlaceholder={t.home.searchPlaceholder}
        isRTL={isRTL}
        isOpen={openDropdown === "propertyTypes"}
        onToggle={() => toggleDropdown("propertyTypes")}
      />

      <div className="flex justify-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
        {currentTransactionTypesData &&
          currentTransactionTypesData.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`flex-1 rounded-full px-2 py-2 text-[15px] font-[700] text-[#556885] transition-colors duration-300 ease-in-out ${
                selectedOption === option.id
                  ? "bg-[#F78A6F] text-white"
                  : "text-primary-900 bg-transparent hover:bg-[#F78A6F]/20"
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.name}
            </button>
          ))}
      </div>

      <ButtonSubmit
        text={
          <span className="flex items-center justify-center gap-2 text-[16px] font-[700]">
            {t.home.searchButton}
          </span>
        }
        className="!w-full rounded-4xl !bg-[#F78A6F]"
      />
    </form>
  );
}

// Reusable component for displaying selected items with scrolling
const ScrollableTags = ({ items, onRemoveItem, isRTL }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener("scroll", checkScrollability);
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(el);

      return () => {
        el.removeEventListener("scroll", checkScrollability);
        resizeObserver.unobserve(el);
      };
    }
  }, [items]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="bg-opacity-75 absolute left-0 z-10 rounded-full bg-white p-2"
        >
          <FaChevronLeft />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth px-1 py-2 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {items.map((item) => (
          <span
            key={item.id}
            className="flex items-center rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium text-black"
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
          className="bg-opacity-75 absolute right-0 z-10 cursor-pointer rounded-full bg-white p-2"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

// Updated MobileRegionFilter Component
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
      {/* This is the component's appearance on the main page */}
      <div
        onClick={onToggle}
        className="mb-2 cursor-pointer space-y-2 rounded-full border border-gray-300 bg-white p-2 py-3"
      >
        <ScrollableTags
          items={selectedItems}
          onRemoveItem={toggleItem}
          isRTL={isRTL}
        />
        <div className="flex items-center justify-between px-2">
          <p className="text-md text-gray-500">
            {selectedItems.length > 0 ? t.home.searchPlaceholder : placeholder}
          </p>
          <span className="text-primary-600 text-xl">
            <LuSearch />
          </span>
        </div>
      </div>

      {/* This is the full-screen modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-white">
          <div className="flex h-full flex-col">
            {/* New Header as per screenshot */}
            <div className="mt-2 flex items-center gap-2 p-4">
              <button onClick={onToggle} className="p-2 text-xl">
                <FaArrowRight className="text-[#F78A6F]" />
              </button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-[#F78A6F]/50 py-3 pr-4 pl-10 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={onToggle}
                className="rounded-lg bg-[#F78A6F] px-5 py-3 font-bold text-white"
              >
                {t.home.searchButton}
              </button>
            </div>

            {/* Selected items section */}
            <div className="border-b border-gray-300 p-2">
              <ScrollableTags
                items={selectedItems}
                onRemoveItem={toggleItem}
                isRTL={isRTL}
              />
            </div>

            {/* List of regions */}
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
                        type="checkbox" // Changed to checkbox for multiple selections
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

                    {/* IMPORTANT: Using 'properties_count' from your API response */}
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

//=============================================================//

//8-27-2025
// import React, { useState, useEffect } from "react";
// import { useLanguage } from "../../context/LanguageContext";
// import HeroDesktop from "./HeroDesktop";
// import HeroMobile from "./HeroMobile";
// import { useMediaQuery } from "./homeComponents/useMediaQuery";

// export function Hero({ onSearch }) {
//   // Changed to named export
//   const {
//     t,
//     isRTL,
//     currentRegionData,
//     currentTransactionTypesData,
//     currentPropertyTypesData,
//   } = useLanguage();

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   useEffect(() => {
//     if (currentTransactionTypesData?.length > 0 && !selectedCategory) {
//       setSelectedCategory(currentTransactionTypesData[0]);
//     }
//   }, [currentTransactionTypesData, selectedCategory]);

//   const executeSearch = () => {
//     // --- DEBUGGING LINE ---
//     // This will show us the category ID in the browser console.
//     console.log("Searching with Category ID:", selectedCategory?.id);

//     onSearch({
//       transactionType: selectedCategory?.id,
//       regions: selectedRegions.map((r) => r.id).filter(Boolean),
//       propertyTypes: selectedPropertyTypes.map((p) => p.id).filter(Boolean),
//       minPrice: minPrice,
//       maxPrice: maxPrice,
//     });
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     executeSearch();
//   };

//   const toggleDropdown = (dropdownName) => {
//     setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const commonProps = {
//     t,
//     isRTL,
//     selectedCategory,
//     setSelectedCategory,
//     currentTransactionTypesData,
//     openDropdown,
//     toggleDropdown,
//     currentRegionData,
//     selectedRegions,
//     setSelectedRegions,
//     currentPropertyTypesData,
//     selectedPropertyTypes,
//     setSelectedPropertyTypes,
//     minPrice,
//     setMinPrice,
//     maxPrice,
//     setMaxPrice,
//     executeSearch,
//     handleFormSubmit,
//   };

//   return isDesktop ? (
//     <HeroDesktop {...commonProps} />
//   ) : (
//     <HeroMobile {...commonProps} />
//   );
// }
