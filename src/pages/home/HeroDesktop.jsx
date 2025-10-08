import React from "react";
import { MultiSelectDropdown } from "../../components/shared/FilterDropdown";
import PriceFilter from "./homeComponents/PriceFilter";

// This component is ONLY for the desktop view
export default function HeroDesktop(props) {
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
        <h1 className="mt-4 mb-4 text-center text-xl font-bold text-gray-800 lg:text-2xl">
          شقق للإيجار | منازل للبيع
        </h1>
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
                    : "font-[700] text-gray-700 hover:bg-gray-200"
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
          {/* <button
            type="submit"
            className="mx-auto w-lg rounded-full bg-[#F78A6F] px-6 py-3 font-bold text-white transition"
          >
            ابحث الآن
          </button> */}

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
