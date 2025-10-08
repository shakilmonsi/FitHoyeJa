import React from "react";
import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
import PriceFilter from "./homeComponents/PriceFilter";

export default function HeroMobile(props) {
  const {
    t,
    isRTL,
    selectedCategory,
    setSelectedCategory,
    currentTransactionTypesData,
    openDropdown,
    toggleDropdown,
    currentRegionData,
    selectedRegions,
    setSelectedRegions,
    currentPropertyTypesData,
    selectedPropertyTypes,
    setSelectedPropertyTypes,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    executeSearch,
    handleFormSubmit,
  } = props;

  return (
    <section className="bg-white py-2 sm:py-8">
      <div className="container mx-auto px-4">
        <span className="mt-4 mb-2 flex justify-center text-center font-[800] font-bold text-gray-800 lg:text-2xl">
          شقق للإيجار | منازل للبيع
        </span>
        <form
          onSubmit={handleFormSubmit}
          className="mx-auto w-full max-w-2xl py-4 lg:w-md"
        >
          <div className="mt-2 mb-3 flex items-center justify-center gap-1 overflow-hidden rounded-full border border-gray-200 bg-gray-50 p-1 py-2">
            {(currentTransactionTypesData || []).map((option) => (
              <button
                key={option.id}
                type="button"
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ease-in-out ${
                  selectedCategory?.id === option.id
                    ? "bg-sky-500 text-white shadow"
                    : "text-gr-700 text-sm font-[700] hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(option)}
              >
                {option.name}
              </button>
            ))}
          </div>

          {/* UPDATED: Changed 'grid-cols-1 sm:grid-cols-3' to 'grid-cols-3' to apply to all screen sizes */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            <MultiSelectDropdown
              options={currentRegionData || []}
              selectedItems={selectedRegions}
              setSelectedItems={setSelectedRegions}
              placeholder={t.home.typeAreaPlaceholder}
              searchPlaceholder={t.home.searchPlaceholder}
              isRTL={isRTL}
              isOpen={openDropdown === "regions"}
              onToggle={() => toggleDropdown("regions")}
            />
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
            <PriceFilter
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onPriceSearch={executeSearch}
              t={t}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-64 items-center rounded-full bg-[#F78A6F] px-6 py-3 font-bold text-white transition lg:w-lg"
            >
              ابحث الآن
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

//=============================================================================//8-27-2025
// import React, { useState } from "react";
// import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
// import PriceFilter from "./homeComponents/PriceFilter";
// import { LuChevronDown } from "react-icons/lu";
// import AreaFilterModal from "./homeComponents/AreaFilterModal";

// export default function HeroMobile(props) {
//   const {
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
//   } = props;

//   const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

//   const getAreaButtonText = () => {
//     if (selectedRegions.length === 0) {
//       return t.home.typeAreaPlaceholder;
//     }
//     if (selectedRegions.length === 1) {
//       return selectedRegions[0].name;
//     }
//     return `${selectedRegions.length} ${isRTL ? "مناطق" : "Areas"}`;
//   };

//   return (
//     <>
//       <section className="bg-white sm:py-8">
//         <div className="container mx-auto px-4">
//           <span className="mt-1 flex justify-center text-center font-[800] font-bold text-gray-800 lg:text-2xl">
//             شقق للإيجار | منازل للبيع
//           </span>
//           <form
//             onSubmit={handleFormSubmit}
//             className="mx-auto w-full max-w-2xl py-1 lg:w-md"
//           >
//             <div className="mt-1 mb-1 flex items-center justify-center gap-1 overflow-hidden rounded-full border border-gray-200 bg-gray-50 p-2">
//               {(currentTransactionTypesData || []).map((option) => (
//                 <button
//                   key={option.id}
//                   type="button"
//                   className={`flex-1 rounded-full px-4 py-1 text-sm font-bold transition-colors duration-300 ease-in-out ${
//                     selectedCategory?.id === option.id
//                       ? "bg-sky-500 text-white shadow"
//                       : "text-xs font-[700] text-gray-700 hover:bg-gray-200"
//                   }`}
//                   onClick={() => setSelectedCategory(option)}
//                 >
//                   {option.name}
//                 </button>
//               ))}
//             </div>

//             <div className="mb-1.5 grid grid-cols-3 gap-2 pr-4">
//               <button
//                 type="button"
//                 onClick={() => setIsAreaModalOpen(true)}
//                 className="flex w-24 cursor-pointer items-center justify-between rounded-full border border-gray-300 bg-white p-1 text-xs font-[500] focus-within:ring-1 focus-within:ring-gray-200 lg:w-full"
//               >
//                 <span className="truncate px-1">{getAreaButtonText()}</span>
//                 <LuChevronDown className="h-4 w-4" />
//               </button>

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
//               <PriceFilter
//                 minPrice={minPrice}
//                 setMinPrice={setMinPrice}
//                 maxPrice={maxPrice}
//                 setMaxPrice={setMaxPrice}
//                 onPriceSearch={executeSearch}
//                 t={t}
//               />
//             </div>
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="w-64 items-center rounded-full bg-[#F78A6F] px-6 py-2.5 text-xs font-bold text-white transition lg:w-lg"
//               >
//                 ابحث الآن
//               </button>
//             </div>
//           </form>
//         </div>
//       </section>

//       <AreaFilterModal
//         isOpen={isAreaModalOpen}
//         onClose={() => setIsAreaModalOpen(false)}
//         options={currentRegionData || []}
//         selectedItems={selectedRegions}
//         setSelectedItems={setSelectedRegions}
//         t={t}
//         isRTL={isRTL}
//       />
//     </>
//   );
// }
