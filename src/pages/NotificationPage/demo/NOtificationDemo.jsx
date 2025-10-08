import React from "react";

const adsData = [
  {
    id: 1,
    title: "إعلان جديد",
    time: "قبل 12 ساعة",
    details: "بنك ومكتب. للبيع وتأجير المحلات",
    code: "COD-23239",
  },
  {
    id: 2,
    title: "إعلان جديد",
    time: "قبل 10 ساعات",
    details: "بنك ومكتب. للبيع وتأجير المحلات",
    code: "COD-244",
  },
  {
    id: 3,
    title: "إعلان جديد",
    time: "قبل 10 ساعات",
    details: "بنك ومكتب. للبيع وتأجير المحلات",
    code: "COD-4245",
  },
];

const NOtificationDemo = () => {
  const SearchBar = () => {
    return (
      <div className="mx-auto mb-4 flex max-w-lg items-center justify-end rounded-full bg-white p-2.5 shadow-md">
        <input
          type="text"
          placeholder="...Search by Ad Code"
          className="flex-grow px-4 py-2 text-right text-gray-700 placeholder-gray-400 outline-none"
          dir="rtl"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    );
  };

  const AdCard = ({ title, time, details, code }) => {
    return (
      <div className="mb-4 rounded-xl bg-white p-4 shadow-md">
        <div className="mb-2 flex items-start justify-between">
          <span className="text-sm text-gray-500">{time}</span>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <p className="mb-2 leading-snug text-gray-600">{details}</p>
        <div className="flex items-center justify-end font-bold text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.265 18 3 13.735 3 8V6z" />
          </svg>
          <span>{code}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="block min-h-screen justify-center bg-gray-100 p-4 pb-25 font-[Tajawal] sm:hidden sm:pb-3">
      <div className="container max-w-lg" dir="rtl">
        <SearchBar />
        {adsData.map((ad) => (
          <AdCard
            key={ad.id}
            title={ad.title}
            time={ad.time}
            details={ad.details}
            code={ad.code}
          />
        ))}
      </div>
    </div>
  );
};

export default NOtificationDemo;
