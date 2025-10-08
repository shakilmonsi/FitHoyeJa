// // import AdCard from "../../../components/shared/AdCard";
// // import { useLanguage } from "../../../context/LanguageContext";

// // export default function PropertyList({ properties, isLoading, onCardClick }) {
// //   const { t, language, isRTL } = useLanguage();

// //   if (isLoading && properties.length === 0) {
// //     return (
// //       <div className="flex flex-col items-center space-y-4">
// //         {Array.from({ length: 5 }).map((_, i) => (
// //           <div
// //             key={i}
// //             className="h-36 w-full max-w-3xl animate-pulse rounded-lg bg-gray-200"
// //           />
// //         ))}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="flex flex-col items-center">
// //       {/* Centered Heading */}
// //       <div className="mb-4 w-full max-w-5xl lg:w-1/2">
// //         <h2 className="text-lg font-semibold text-gray-800">
// //           عقارات للايجار في الكويت ({properties.length})
// //         </h2>
// //       </div>

// //       {properties.length === 0 && !isLoading ? (
// //         <div className="py-20 text-center">
// //           <h2 className="text-xl font-semibold text-gray-700">
// //             No Properties Found
// //           </h2>
// //           <p className="text-gray-500">Try adjusting your filters.</p>
// //         </div>
// //       ) : (
// //         <div className="flex w-full flex-col items-center space-y-2">
// //           {properties.map((property) => (
// //             <div key={property.id} className="w-full max-w-5xl lg:w-1/2">
// //               <AdCard
// //                 ad={property}
// //                 t={t}
// //                 language={language}
// //                 isRTL={isRTL}
// //                 onClick={onCardClick}
// //               />
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// //=============================================================================//
// import AdCard from "../../../components/shared/AdCard";
// import { useLanguage } from "../../../context/LanguageContext";

// export default function PropertyList({
//   properties = [],
//   allProperties = [],
//   isLoading,
//   onCardClick,
// }) {
//   const { t, language, isRTL } = useLanguage();

//   // If filtered properties are empty, we'll use all properties instead
//   const displayProperties =
//     (!properties || properties.length === 0) && !isLoading && allProperties
//       ? allProperties
//       : properties || [];

//   if (isLoading && properties.length === 0) {
//     return (
//       <div className="flex flex-col items-center space-y-4">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <div
//             key={i}
//             className="h-36 w-full max-w-3xl animate-pulse rounded-lg bg-gray-200"
//           />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <div className="w-full max-w-5xl lg:w-1/2">
//         <h2 className="text-md py-0.5 font-semibold text-gray-800">
//           عقارات للايجار في الكويت ({displayProperties.length})
//         </h2>
//       </div>

//       <div className="flex w-full flex-col items-center space-y-1">
//         {displayProperties.map((property) => (
//           <div key={property.id} className="w-full max-w-5xl lg:w-1/2">
//             <AdCard
//               ad={property}
//               t={t}
//               language={language}
//               isRTL={isRTL}
//               onClick={onCardClick}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
