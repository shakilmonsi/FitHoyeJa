// import React, { useState, useEffect } from "react";
// import { MultiSelectDropdown } from "../../../components/shared/FilterDropdown";
// import { useLanguage } from "../../../context/LanguageContext";
// import ButtonSubmit from "../../../common/button/ButtonSubmit";

// //         ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// // THE FIX IS HERE: Make sure 'onSearch' is listed as a prop to be received.
// export function PropertyFilters({ onSearch, t, isRTL, regionsData }) {
//   const { currentTransactionTypesData, currentPropertyTypesData } =
//     useLanguage();

//   const [selectedOption, setSelectedOption] = useState("");
//   const [selectedRegions, setSelectedRegions] = useState([]);
//   const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   useEffect(() => {
//     if (currentTransactionTypesData && currentTransactionTypesData.length > 0) {
//       setSelectedOption(currentTransactionTypesData[0]?.id || "");
//     }
//   }, [currentTransactionTypesData]);

//   const toggleDropdown = (dropdownName) => {
//     setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     // This line will now work because 'onSearch' is a valid function
//     onSearch({
//       transactionType: selectedOption,
//       regions: selectedRegions
//         .map((r) => r.id)
//         .filter((id) => id && id !== "all"),
//       propertyTypes: selectedPropertyTypes
//         .map((p) => p.id)
//         .filter((id) => id && id !== "all"),
//     });
//   };

//   return (
//     <form onSubmit={handleSearch} className="space-y-4">
//       {/* Region Filter Dropdown */}
//       <MultiSelectDropdown
//         options={regionsData || []}
//         selectedItems={selectedRegions}
//         setSelectedItems={setSelectedRegions}
//         placeholder={t.home.typeAreaPlaceholder}
//         searchPlaceholder={t.home.searchPlaceholder}
//         isRTL={isRTL}
//         isOpen={openDropdown === "regions"}
//         onToggle={() => toggleDropdown("regions")}
//       />

//       {/* Property Type Dropdown */}
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

//       {/* Transaction Type Buttons */}
//       <div className="flex justify-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
//         {(currentTransactionTypesData || []).map((option) => (
//           <button
//             key={option.id}
//             type="button"
//             className={`flex-1 rounded-full px-2 py-2 text-[15px] font-[700] text-[#556885] transition-colors duration-300 ease-in-out ${
//               selectedOption === option.id
//                 ? "bg-primary-500 text-white"
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
//           <span className="flex items-center gap-2 text-[15px] font-[700]">
//             {t.home.searchButton}
//           </span>
//         }
//         className="!w-full rounded-4xl"
//       />
//     </form>
//   );
// }
