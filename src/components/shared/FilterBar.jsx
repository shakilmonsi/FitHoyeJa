import React, { useState, useEffect } from "react";
import { MultiSelectDropdown } from "./FilterDropdown";
import { useLanguage } from "../../context/LanguageContext";

export const FilterBar = ({ onFilter }) => {
  const {
    t,
    isRTL,
    currentRegionData,
    currentTransactionTypesData,
    currentPropertyTypesData,
  } = useLanguage();

  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);

  useEffect(() => {
    if (currentTransactionTypesData?.length > 0) {
      setSelectedTransactionType(currentTransactionTypesData[0]?.id || "");
    }
  }, [currentTransactionTypesData]);

  const handleFilter = () => {
    onFilter({
      transactionType: selectedTransactionType,
      regions: selectedRegions
        .map((r) => r.id)
        .filter((id) => id && id !== "all"),
      propertyTypes: selectedPropertyTypes
        .map((p) => p.id)
        .filter((id) => id && id !== "all"),
    });
  };

  const handleReset = () => {
    setSelectedTransactionType(currentTransactionTypesData[0]?.id || "");
    setSelectedRegions([]);
    setSelectedPropertyTypes([]);
    onFilter({});
  };

  return (
    <div className="mb-6 w-full rounded-lg bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MultiSelectDropdown
          options={currentRegionData || []}
          selectedItems={selectedRegions}
          setSelectedItems={setSelectedRegions}
          placeholder={t.home.typeAreaPlaceholder}
          searchPlaceholder={t.home.searchPlaceholder}
          isRTL={isRTL}
          onSelect={handleFilter}
        />
        <MultiSelectDropdown
          options={currentPropertyTypesData || []}
          selectedItems={selectedPropertyTypes}
          setSelectedItems={setSelectedPropertyTypes}
          placeholder={t.home.propertyTypePlaceholder}
          searchPlaceholder={t.home.searchPlaceholder}
          isRTL={isRTL}
          onSelect={handleFilter}
        />
        <MultiSelectDropdown
          options={currentTransactionTypesData || []}
          selectedItems={
            selectedTransactionType ? [{ id: selectedTransactionType }] : []
          }
          setSelectedItems={(items) => {
            setSelectedTransactionType(items[0]?.id || "");
            handleFilter();
          }}
          placeholder={t.home.transactionTypePlaceholder}
          isRTL={isRTL}
          singleSelect={true}
          onSelect={handleFilter}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleReset}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {t.search.reset}
        </button>
      </div>
    </div>
  );
};
