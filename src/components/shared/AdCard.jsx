import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const AdCard = ({ ad, t, language, isSelected, isRTL, onClick }) => {
  const navigate = useNavigate();

  const getDaysAgo = (postDate) => {
    if (!postDate || postDate === "N/A") return "";
    const now = new Date();
    const post = new Date(postDate.replace(",", ""));
    const diffTime = now - post;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t?.days?.today || "Today";
    return `${diffDays} ${t?.days?.days || "Days"}`;
  };

  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined) return "";
    return parseFloat(number).toLocaleString("en-US");
  };

  const getCardBackgroundClass = () => {
    if (ad.is_featured) {
      return "bg-[#4481BC] text-white border-2 border-transparent";
    }
    return `bg-[#F7EFF1] hover:border-red-500 border-1 ${isSelected ? "border-red-500" : "border-transparent"}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(ad);
    } else {
      navigate(`/ads/${ad.slug}`);
    }
  };

  const imageUrl =
    ad.primary_image?.file ||
    "https://placehold.co/112x112/EBF4FF/333333?text=Ad";

  return (
    <div onClick={handleClick} className="group w-full cursor-pointer">
      <div
        className={`relative w-full justify-center border border-gray-200 lg:w-2xl ${getCardBackgroundClass()} p-3 text-black shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-4`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-md sm:h-28 sm:w-28">
              <img
                alt={ad.title}
                src={imageUrl}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            {ad.is_featured && (
              <div className="absolute -start-1.5 -top-1.5">
                {isRTL ? (
                  <svg
                    width="49"
                    height="37"
                    viewBox="0 0 49 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M49 27.6018L40 37V20L49 27.6018Z"
                      fill="#821220"
                    ></path>
                    <path
                      d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H47C47.8284 0.5 48.5 1.17157 48.5 2V27.5H2C1.17157 27.5 0.5 26.8284 0.5 26V2Z"
                      fill="#D7263D"
                      stroke="#D7263D"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    width="49"
                    height="37"
                    viewBox="0 0 49 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 27.6018L9 37V20L0 27.6018Z"
                      fill="#821220"
                    ></path>
                    <path
                      d="M48.5 2C48.5 1.17157 47.8284 0.5 47 0.5H2C1.17157 0.5 0.5 1.17157 0.5 2V27.5H47C47.8284 27.5 48.5 26.8284 48.5 26V2Z"
                      fill="#D7263D"
                      stroke="#D7263D"
                    ></path>
                  </svg>
                )}
                <div className="absolute start-0.5 top-0 flex h-[28px] w-full items-center justify-center">
                  <h3 className="overflow-hidden px-1 text-sm whitespace-nowrap text-white">
                    {t.ads.super}
                  </h3>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h2
              className={`line-clamp-2 font-[700] break-words ${ad.is_featured ? "text-white" : "text-gray-800"}`}
            >
              {ad.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <h4
                className={`font-[600] ${ad.is_featured ? "text-white" : "text-sky-600"}`}
              >
                <span className="text-base font-[700] text-[#2e6190]">
                  {formatNumberWithCommas(Math.round(ad.price))}{" "}
                  {t.ads.currency}
                </span>
              </h4>
              <div
                className={`flex items-center gap-1 text-[14px] ${ad.is_featured ? "text-gray-200" : "text-gray-500"}`}
              >
                <FiClock />
                <span>
                  <span className="text-[14px]">
                    {getDaysAgo(ad.created_at)}
                  </span>
                </span>
              </div>
            </div>
            <p
              className={`mt-2 line-clamp-2 text-sm font-[400] ${ad.is_featured ? "text-gray-200" : "text-[#556885]"}`}
            >
              {ad.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;

//--=============================================--//8-27-205

// import { useNavigate } from "react-router-dom";
// import { FiClock } from "react-icons/fi";

// const AdCard = ({ ad, t, language, isRTL, onClick }) => {
//   const navigate = useNavigate();

//   const getDaysAgo = (postDate) => {
//     if (!postDate || postDate === "N/A") return "";
//     const now = new Date();
//     const post = new Date(postDate.replace(",", ""));
//     const diffTime = now - post;
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     if (diffDays === 0) return t?.days?.today || "Today";
//     return `${diffDays} ${t?.days?.days || "Days"}`;
//   };

//   const formatNumberWithCommas = (number) => {
//     if (number === null || number === undefined) return "";
//     return parseFloat(number).toLocaleString("en-US");
//   };

//   const getCardBackgroundClass = () => {
//     if (ad.is_featured) {
//       return "bg-[#4481BC] text-white";
//     }
//     return "bg-[#F6EEF0]";
//   };

//   const handleClick = () => {
//     if (onClick) {
//       onClick(ad);
//     } else {
//       navigate(`/ads/${ad.slug}`);
//     }
//   };

//   const imageUrl =
//     ad.primary_image?.file ||
//     "https://placehold.co/112x112/EBF4FF/333333?text=Ad";

//   return (
//     <div onClick={handleClick} className="group w-full cursor-pointer">
//       <div
//         className={`relative w-full justify-center border border-gray-200 lg:w-2xl ${getCardBackgroundClass()} p-2 text-black shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-4`}
//       >
//         <div className="flex items-center gap-3 sm:gap-4">
//           <div className="relative flex-shrink-0">
//             <div className="h-24 w-24 overflow-hidden rounded-md sm:h-28 sm:w-28">
//               <img
//                 // alt={ad.title}
//                 src={imageUrl}
//                 loading="lazy"
//                 className="h-full w-full object-cover text-xs"
//               />
//             </div>
//             {ad.is_featured && (
//               <div className="absolute -start-1.5 -top-1.5">
//                 {isRTL ? (
//                   <svg
//                     width="49"
//                     height="37"
//                     viewBox="0 0 49 37"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M49 27.6018L40 37V20L49 27.6018Z"
//                       fill="#821220"
//                     ></path>
//                     <path
//                       d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H47C47.8284 0.5 48.5 1.17157 48.5 2V27.5H2C1.17157 27.5 0.5 26.8284 0.5 26V2Z"
//                       fill="#D7263D"
//                       stroke="#D7263D"
//                     ></path>
//                   </svg>
//                 ) : (
//                   <svg
//                     width="49"
//                     height="37"
//                     viewBox="0 0 49 37"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M0 27.6018L9 37V20L0 27.6018Z"
//                       fill="#821220"
//                     ></path>
//                     <path
//                       d="M48.5 2C48.5 1.17157 47.8284 0.5 47 0.5H2C1.17157 0.5 0.5 1.17157 0.5 2V27.5H47C47.8284 27.5 48.5 26.8284 48.5 26V2Z"
//                       fill="#D7263D"
//                       stroke="#D7263D"
//                     ></path>
//                   </svg>
//                 )}
//                 <div className="absolute start-0.5 top-0 flex h-[28px] w-full items-center justify-center">
//                   <h3 className="overflow-hidden px-1 text-sm whitespace-nowrap text-white">
//                     {t.ads.super}
//                   </h3>
//                 </div>
//               </div>
//             )}
//           </div>
//           <div className="flex-1 overflow-hidden">
//             <h3
//               className={`line-clamp-2 font-semibold break-words ${ad.is_featured ? "text-white" : "text-gray-800"}`}
//             >
//               {ad.title}
//             </h3>
//             <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
//               <h4
//                 className={`font-bold ${ad.is_featured ? "text-white" : "text-sky-600"}`}
//               >
//                 {formatNumberWithCommas(ad.price)} {t.ads.currency}
//               </h4>
//               <div
//                 className={`flex items-center gap-1 text-sm ${ad.is_featured ? "text-gray-200" : "text-gray-500"}`}
//               >
//                 <FiClock />
//                 <span>{getDaysAgo(ad.created_at)}</span>
//               </div>
//             </div>
//             <p
//               className={`mt-2 line-clamp-2 text-sm ${ad.is_featured ? "text-gray-200" : "text-gray-600"}`}
//             >
//               {ad.description}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdCard;
