// import React, { useState, useEffect, useMemo } from "react";
// import axios from "../../utils/axiosInstance";
// import { useLanguage } from "../../context/LanguageContext";
// import PropertyList from "./homeComponents/PropertyList";
// import DetailsModal from "../adDetails/Modal";
// import Hero from "./Hero";

// export function Home() {
//   const [allProperties, setAllProperties] = useState([]);
//   const [displayedProperties, setDisplayedProperties] = useState([]);

//   const [filters, setFilters] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAll, setShowAll] = useState(false);

//   // Modal state remains the same
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAd, setSelectedAd] = useState(null);
//   const { isRTL, t, language } = useLanguage();

//   // This useEffect runs only once to fetch ALL properties
//   useEffect(() => {
//     const fetchAllProperties = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get("/properties");
//         setAllProperties(response.data.data || []);
//       } catch (err) {
//         console.error("Failed to fetch properties:", err);
//         setError("Could not load properties. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchAllProperties();
//   }, []);

//   // This useMemo re-calculates the filtered list whenever filters or the master list changes
//   const filteredProperties = useMemo(() => {
//     let propertiesToShow = [...allProperties];

//     if (filters) {
//       propertiesToShow = allProperties.filter((ad) => {
//         const transactionMatch = filters.transactionType
//           ? ad.category_id == filters.transactionType
//           : true;

//         const regionMatch =
//           filters.regions?.length > 0
//             ? filters.regions.includes(ad.area_id)
//             : true;

//         const propertyTypeMatch =
//           filters.propertyTypes?.length > 0
//             ? filters.propertyTypes.includes(ad.property_type_id)
//             : true;

//         // Price filter (New)
//         const adPrice = parseFloat(ad.price);
//         const minPrice = parseFloat(filters.minPrice);
//         const maxPrice = parseFloat(filters.maxPrice);
//         const priceMatch =
//           (isNaN(minPrice) || adPrice >= minPrice) &&
//           (isNaN(maxPrice) || adPrice <= maxPrice);

//         return (
//           transactionMatch && regionMatch && propertyTypeMatch && priceMatch
//         );
//       });
//     }

//     // Sort by featured ads first
//     propertiesToShow.sort(
//       (a, b) => Number(b.is_featured) - Number(a.is_featured),
//     );

//     return propertiesToShow;
//   }, [filters, allProperties]);

//   useEffect(() => {
//     if (showAll) {
//       setDisplayedProperties(filteredProperties);
//     } else {
//       setDisplayedProperties(filteredProperties.slice(0, 4));
//     }
//   }, [filteredProperties, showAll]);

//   // --- Event Handlers ---
//   const handleAdClick = async (ad) => {
//     setSelectedAd(ad);
//     setShowModal(true);
//     try {
//       await axios.post(`/properties/view/${ad.id}`);
//     } catch (viewError) {
//       console.error("Failed to update view count:", viewError);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setTimeout(() => setSelectedAd(null), 300);
//   };

//   const handleSearch = (newFilters) => {
//     // When a new search happens, reset to the paginated view
//     setShowAll(false);
//     setFilters(newFilters);
//   };

//   const handleLoadMore = () => {
//     setShowAll(true);
//   };

//   return (
//     <>
//       <Hero onSearch={handleSearch} />
//       <main className="container mx-auto p-1">
//         {error ? (
//           <div className="py-20 text-center text-red-500">{error}</div>
//         ) : (
//           <PropertyList
//             properties={displayedProperties}
//             allProperties={allProperties}
//             totalAds={filteredProperties.length}
//             isLoading={isLoading}
//             onCardClick={handleAdClick}
//           />
//         )}
//         {/* Show "Load More" button only if there are more than 4 filtered results and not all are shown */}
//         {!showAll && filteredProperties.length > 4 && (
//           <div className="mt-4 text-center">
//             <button
//               onClick={handleLoadMore}
//               className="bg-primary-500 hover:bg-primary-600 rounded-lg px-6 py-3 font-bold text-white"
//             >
//               Load More
//             </button>
//           </div>
//         )}
//       </main>
//       {showModal && selectedAd && (
//         <DetailsModal
//           show={showModal}
//           onClose={closeModal}
//           ad={selectedAd}
//           t={t}
//           isRTL={isRTL}
//           language={language}
//         />
//       )}
//     </>
//   );
// }

import HeroSection from "./Hero";
import Ads from "./Ads";
import { useLanguage } from "../../context/LanguageContext";

export const Home = () => {
  const { isRTL, t } = useLanguage();
  return (
    <div>
      <HeroSection isRTL={isRTL} t={t} />
      <Ads />
    </div>
  );
};
