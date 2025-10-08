// import React, { useMemo } from "react";

// const isPropertyNew = (createdAt) => {
//   if (!createdAt) return false;
//   const postDate = new Date(createdAt);
//   const now = new Date();
//   const twentyFourHours = 24 * 60 * 60 * 1000;
//   return now.getTime() - postDate.getTime() < twentyFourHours;
// };

// export default function PropertyCard({ property }) {
//   const isNew = useMemo(
//     () => isPropertyNew(property.created_at),
//     [property.created_at],
//   );
//   const imageUrl =
//     property.primary_image?.file ||
//     "https://via.placeholder.com/400x300.png?text=No+Image";

//   return (
//     <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-xl">
//       {isNew && (
//         <div className="absolute top-2 right-2 z-10 rounded-full bg-blue-500 px-3 py-1 text-xs font-bold text-white">
//           New
//         </div>
//       )}

//       <img
//         src={imageUrl}
//         alt={property.title}
//         className="h-48 w-full object-cover"
//       />

//       <div className="p-4">
//         <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
//         <p className="text-md text-gray-600">
//           {property.area?.name || "Area not specified"}
//         </p>
//         <p className="text-primary-600 mt-2 text-xl font-extrabold">
//           ${parseFloat(property.price).toLocaleString()}
//         </p>
//       </div>
//     </div>
//   );
// }
