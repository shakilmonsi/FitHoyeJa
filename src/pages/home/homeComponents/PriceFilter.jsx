// import React, { useState, useEffect, useRef } from "react";

// export default function PriceFilter({
//   minPrice,
//   setMinPrice,
//   maxPrice,
//   setMaxPrice,
//   onPriceSearch,
//   t,
// }) {
//   const [isOpen, setIsOpen] = useState(false);

//   // --- Click Outside Logic ---
//   const filterRef = useRef(null); // Create a reference to the component's container

//   useEffect(() => {
//     // This function will be called whenever a click happens anywhere on the page
//     function handleClickOutside(event) {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setIsOpen(false); // Close the popover if the click is outside
//       }
//     }

//     // Add the event listener when the popover is open
//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     // Clean up the event listener when the component is removed or popover closes
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]); // This effect depends on the 'isOpen' state
//   // --- End of Click Outside Logic ---

//   const handleSearchClick = () => {
//     onPriceSearch();
//     setIsOpen(false);
//   };

//   // Attach the ref to the main container div
//   return (
//     <div className="relative w-full" ref={filterRef}>
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex h-full w-full items-center justify-between rounded-full border border-gray-300 bg-white px-3 py-2 text-gray-700"
//       >
//         <h4 className="text-sm font-[600] text-gray-600 lg:text-lg lg:font-[400]">
//           السعر
//         </h4>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>

//       {isOpen && (
//         <div className="absolute top-full left-0 z-20 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Min Price
//               </label>
//               <input
//                 type="number"
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(e.target.value)}
//                 placeholder="e.g., 100"
//                 className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-[#F78A6F] focus:ring-[#F78A6F]"
//               />
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">
//                 Max Price
//               </label>
//               <input
//                 type="number"
//                 value={maxPrice}
//                 onChange={(e) => setMaxPrice(e.target.value)}
//                 placeholder="e.g., 5000"
//                 className="rounded-ful mt-1 w-full border border-gray-300 p-2 focus:border-[#F78A6F] focus:ring-[#F78A6F]"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleSearchClick}
//               className="lg:text-md w-full rounded-full bg-[#F78A6F] px-4 py-2 text-xs font-bold text-white transition"
//             >
//               ابحث الآن
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown } from "react-icons/lu";

export default function PriceFilter({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onPriceSearch,
  t,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSearchClick = () => {
    onPriceSearch();
    setIsOpen(false);
  };

  // Attach the ref to the main container div
  return (
    <div className="relative w-full" ref={filterRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 flex h-full w-24 items-center justify-between rounded-full border border-gray-300 bg-white px-1 py-1 pr-2 text-gray-700 lg:w-full"
      >
        <h4 className="text-xs font-[600] text-gray-600 lg:text-lg lg:font-[400]">
          السعر
        </h4>

        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <LuChevronDown />
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g., 100"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-[#F78A6F] focus:ring-[#F78A6F]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g., 5000"
                className="rounded-ful mt-1 w-full border border-gray-300 p-2 focus:border-[#F78A6F] focus:ring-[#F78A6F]"
              />
            </div>
            <button
              type="button"
              onClick={handleSearchClick}
              className="lg:text-md w-full rounded-full bg-[#F78A6F] px-4 py-2 text-xs font-bold text-white transition"
            >
              ابحث الآن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
