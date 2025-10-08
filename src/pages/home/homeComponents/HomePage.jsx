// import React, { useState, useEffect, useCallback } from "react";
// import HeroWithFilters from "../components/HeroWithFilters"; // <-- 1. CHANGE THIS IMPORT
// import PropertyList from "./PropertyList"; // Adjust path if needed
// import { apiGetProperties } from "./api"; // Adjust path if needed

// const PAGE_SIZE = 10;

// export default function HomePage() {
//   const [properties, setProperties] = useState([]);
//   const [filters, setFilters] = useState(null);
//   const [page, setPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // No changes to this function
//   const fetchProperties = useCallback(async (currentFilters, currentPage) => {
//     setIsLoading(true);
//     try {
//       const response = await apiGetProperties({
//         page: currentPage,
//         limit: PAGE_SIZE,
//         filters: currentFilters,
//       });
//       const newProperties = response.data || [];
//       setProperties((prev) =>
//         currentPage === 1 ? newProperties : [...prev, ...newProperties],
//       );
//       setHasMore(newProperties.length === PAGE_SIZE);
//     } catch (error) {
//       console.error("Failed to fetch properties:", error);
//       setHasMore(false);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // No changes to this useEffect
//   useEffect(() => {
//     if (page === 1) {
//       fetchProperties(filters, 1);
//     }
//   }, [filters, fetchProperties, page]);

//   // No changes to this function
//   const handleSearch = (newFilters) => {
//     setPage(1);
//     setProperties([]);
//     setFilters(newFilters);
//   };

//   // No changes to this function
//   const handleLoadMore = () => {
//     if (!isLoading) {
//       const nextPage = page + 1;
//       setPage(nextPage);
//       fetchProperties(filters, nextPage);
//     }
//   };

//   return (
//     <>
//       {/* 2. USE THE NEW COMPONENT HERE */}
//       <HeroWithFilters onSearch={handleSearch} />

//       <main className="container mx-auto p-4">
//         <PropertyList
//           properties={properties}
//           isLoading={isLoading && properties.length === 0}
//         />
//         {hasMore && properties.length > 0 && (
//           <div className="mt-8 text-center">
//             <button
//               onClick={handleLoadMore}
//               disabled={isLoading}
//               className="bg-primary-500 hover:bg-primary-600 rounded-lg px-6 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:bg-gray-400"
//             >
//               {isLoading ? "Loading..." : "Load More"}
//             </button>
//           </div>
//         )}
//       </main>
//     </>
//   );
// }
