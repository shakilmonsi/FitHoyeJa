
// import React from "react";
// import { LuArrowRight, LuSearch, LuX } from "react-icons/lu";

// /**
//  * @typedef {object} Option
//  * @property {number | string} id
//  * @property {string} name
//  * @property {number} [properties_count]
//  */

// export default function AreaFilterModal({
//   isOpen,
//   onClose,
//   options,
//   selectedItems,
//   setSelectedItems,
//   t, // Translation function
//   isRTL,
// }) {
//   const [searchTerm, setSearchTerm] = React.useState("");

//   if (!isOpen) {
//     return null;
//   }

//   const toggleItem = (item) => {
//     setSelectedItems((prev) =>
//       prev.some((selected) => selected.id === item.id)
//         ? prev.filter((selected) => selected.id !== item.id)
//         : [...prev, item],
//     );
//   };

//   const filteredOptions = options.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div
//       className="fixed inset-0 z-50 flex flex-col bg-white"
//       dir={isRTL ? "rtl" : "ltr"}
//     >
//       {/* Header Section */}
//       <header className="flex items-center gap-2 border-b border-gray-200 p-4">
//         <button onClick={onClose} className="p-2">
//           {isRTL ? <LuArrowRight size={24} /> : <LuX size={24} />}
//         </button>
//         <div className="relative flex-grow">
//           <input
//             type="text"
//             placeholder={t.home.searchPlaceholder || "اكتب المنطقة للبحث"}
//             className="w-full rounded-full border border-gray-300 bg-gray-100 px-10 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
//             <LuSearch />
//           </span>
//         </div>
//       </header>

//       {/* Options List */}
//       <main className="flex-grow overflow-y-auto">
//         <ul className="p-4">
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option) => (
//               <li
//                 key={option.id}
//                 className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-50"
//                 onClick={() => toggleItem(option)}
//               >
//                 <div className="flex items-center gap-x-3">
//                   <input
//                     type="checkbox"
//                     readOnly
//                     checked={selectedItems.some(
//                       (item) => item.id === option.id,
//                     )}
//                     className="form-checkbox h-5 w-5 cursor-pointer rounded border-gray-300 text-sky-600 focus:ring-sky-500"
//                   />
//                   <span className="text-base text-gray-800">{option.name}</span>
//                 </div>

//                 <span className="text-sm font-medium text-gray-500">
//                   ({option.properties_count ?? 0})
//                 </span>
//               </li>
//             ))
//           ) : (
//             <li className="p-4 text-center text-gray-500">
//               {t.search.noResultsFound}
//             </li>
//           )}
//         </ul>
//       </main>

//       {/* Footer Button */}
//       <footer className="border-t border-gray-200 p-4">
//         <button
//           onClick={onClose}
//           className="w-full rounded-full bg-sky-500 py-3 text-xl font-bold text-white shadow-md transition"
//         >
//           بحث
//         </button>
//       </footer>
//     </div>
//   );
// }
