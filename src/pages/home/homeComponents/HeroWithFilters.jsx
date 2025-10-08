// import React, { useState, useEffect } from "react";
// import { MultiSelectDropdown } from "../../../components/shared/FilterDropdown";
// import { useLanguage } from "../../../context/LanguageContext";
// import ButtonSubmit from "../../../common/button/ButtonSubmit";

// export default function HeroWithFilters({ onSearch }) {
//   const {
//     t,
//     isRTL,
//     currentRegionData,
//     currentTransactionTypesData,
//     currentPropertyTypesData,
//   } = useLanguage();
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
//     <section className="relative h-[84vh] w-full overflow-hidden md:h-[70vh] lg:h-[100vh]">
//       <div className="absolute right-0 bottom-0 left-0 -z-10 w-full">
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
//       </div>
//       <div className="container mx-auto mt-6 flex h-full w-full items-start justify-center px-2 py-4 lg:mt-20">
//         <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
//           <div className="px-4 sm:px-8">
//             <h1 className="mb-3 w-full text-lg font-[700] text-black md:text-xl lg:text-[26px]">
//               {t.home.bannerTitle}
//             </h1>
//             <p className="mb-8 text-[14px] font-normal text-[#556885] md:text-[14px]">
//               {t.home.bannerSubTitle}
//             </p>
//           </div>
//           <div className="shadow-primary-900/30 w-full max-w-md rounded-2xl bg-white/70 p-4 backdrop-blur-sm sm:p-6 lg:-mt-3">
//             <form onSubmit={handleSearch} className="space-y-4">
//               <MultiSelectDropdown
//                 options={currentRegionData || []}
//                 selectedItems={selectedRegions}
//                 setSelectedItems={setSelectedRegions}
//                 placeholder={t.home.typeAreaPlaceholder}
//                 searchPlaceholder={t.home.searchPlaceholder}
//                 isRTL={isRTL}
//                 isOpen={openDropdown === "regions"}
//                 onToggle={() => toggleDropdown("regions")}
//               />
//               <MultiSelectDropdown
//                 options={currentPropertyTypesData || []}
//                 selectedItems={selectedPropertyTypes}
//                 setSelectedItems={setSelectedPropertyTypes}
//                 placeholder={t.home.propertyTypePlaceholder}
//                 searchPlaceholder={t.home.searchPlaceholder}
//                 isRTL={isRTL}
//                 isOpen={openDropdown === "propertyTypes"}
//                 onToggle={() => toggleDropdown("propertyTypes")}
//               />
//               <div className="flex justify-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1">
//                 {(currentTransactionTypesData || []).map((option) => (
//                   <button
//                     key={option.id}
//                     type="button"
//                     className={`flex-1 rounded-full px-2 py-2 text-[15px] font-[700] text-[#556885] transition-colors duration-300 ease-in-out ${selectedOption === option.id ? "bg-primary-500 text-white" : "text-primary-900 hover:bg-primary-300/20 bg-transparent"}`}
//                     onClick={() => setSelectedOption(option.id)}
//                   >
//                     {option.name}
//                   </button>
//                 ))}
//               </div>
//               <ButtonSubmit
//                 text={
//                   <span className="flex items-center gap-2 text-[15px] font-[700]">
//                     {t.home.searchButton}
//                   </span>
//                 }
//                 className="!w-full rounded-4xl"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
