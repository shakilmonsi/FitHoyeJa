import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/LanguageContext";

const TopUpCard = () => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  const openModal = (_title, cardImageSrc) => {
    setModalImageSrc(cardImageSrc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageSrc("");
  };

  const paymentLink =
    "https://www.kpay.com.kw/kpg/paymentpage.htm?PaymentID=107517673000223474#d";

  return (
    <div className="font-inter mx-auto flex min-h-screen max-w-4xl flex-col items-center p-2 text-gray-800">
      <div className="my-5 w-full max-w-4xl px-4 text-left">
        <h2 className="mb-2 text-[18px] font-[700] text-gray-800 sm:text-[18px] lg:text-[22px]">
          {t.byCredit.title}
        </h2>
        <ul className="list-inside list-disc text-sm text-gray-600 sm:text-base">
          <li>{t.byCredit.subtitlefast}</li>
          <p className="flex items-center sm:flex-row sm:items-center">
            <li>{t.byCredit.subtitlastone}</li>
            <span className="text-descripton sm:ml-1">
              {t.byCredit.subtitlastwo}
              <Link
                className="px-1 text-sm font-bold whitespace-nowrap text-[#2e6290]"
                to="tel:01319559275"
              >
                {t.byCredit.bycalling}
              </Link>
              {t.byCredit.subtitlasttwo}
            </span>
            <a
              className="mt-1 px-1 text-sm font-bold whitespace-nowrap text-[#2e6290] sm:mt-0"
              href="https://api.whatsapp.com/send/?phone=96560444900&text=Hello%0AI+need+help+with+Boshamlan&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.byCredit.byWhatsapp}
            </a>
          </p>
        </ul>
      </div>

      <div className="mb-12 grid w-full max-w-5xl grid-cols-1 gap-4 px-4">
        {/* Card 1: Super Credit - New Design */}
        {/* Card 3: Agents Subscription - New Design (with the SVG banner) */}
        <div className="relative flex w-full gap-3 rounded-lg border-1 border-[#e5e7eb] bg-white p-3 shadow-xl">
          <div className="relative shrink-0">
            <button
              className="block cursor-pointer rounded-lg bg-sky-400 px-15 py-10"
              type="button"
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-md">
                <div className="px-2 text-center text-lg leading-5 font-bold text-white">
                  <h3>
                    5 <br className="gap-2 py-2" />
                    <span className="py-2"> KWD</span>
                  </h3>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-grow flex-col justify-center">
            <div className="relative mb-3 flex h-[40px] items-center justify-center">
              <div className="absolute -top-[18px] left-1/2 -translate-x-1/2">
                <svg
                  width="143"
                  height="45"
                  viewBox="0 0 143 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.38 2.86L0.61 6.63L8.51 6.41L7.24 4.54L6.38 2.86Z"
                    fill="#242424"
                  />
                  <g filter="url(#filter0_d)">
                    {/* fds */}
                    <path
                      d="M131.9 27.42C131.5 30.26 129.16 32.42 126.3 32.58L29.66 38.1C26.5 38.28 23.52 36.57 22.08 33.75L6.29 2.88L135.46 2L131.9 27.42Z"
                      fill="#FF0000"
                    />
                  </g>
                  <path
                    d="M135.46 2L141.56 6.43L134.58 6.41L134.98 4.09L135.46 2Z"
                    fill="#242424"
                  />
                  <defs>
                    <filter
                      id="filter0_d"
                      x="2.29"
                      y="0"
                      width="137.16"
                      height="44.11"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="2" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
                <div className="absolute start-6 end-5 top-0 text-white">
                  <div className="absolute top-1.5 left-1/2 max-w-full -translate-x-1/2 overflow-hidden text-xs font-bold whitespace-nowrap">
                    <span className="text-sm font-[600]"> Super</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={`m-auto inline-flex items-center justify-center rounded-lg py-0 text-center text-lg font-semibold text-[#000000]`}
              >
                <span className="font-[600]"> 1 super AD</span>
              </a>
            </div>
          </div>
          <div>
            <button
              className="mx-auto mt-6 flex w-[88px] justify-center rounded-lg bg-[#00BCFF] py-2 text-base font-bold text-white shadow-md transition-colors duration-200 hover:bg-[#1e4a70]"
              onClick={() => window.open(paymentLink, "_blank")}
            >
              BUY
            </button>
          </div>
        </div>

        {/* Card 2: Agents Subscription - New Design (with the SVG banner) */}
        <div className="relative flex w-full gap-3 rounded-lg border-1 border-[#e5e7eb] bg-white p-3 shadow-xl">
          <div className="relative shrink-0">
            <button
              className="block cursor-pointer rounded-lg bg-sky-400 px-15 py-10"
              type="button"
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-md">
                <div className="px-2 text-center text-lg leading-5 font-bold text-white">
                  <h3>
                    3.950 <br className="gap-2 py-2" />
                    <span className="py-2"> KWD</span>
                  </h3>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-grow flex-col justify-center">
            <div className="relative mb-3 flex h-[40px] items-center justify-center">
              <div className="absolute -top-[18px] left-1/2 -translate-x-1/2">
                <div className="absolute start-6 end-5 top-0 text-white">
                  <div className="absolute top-1.5 left-1/2 max-w-full -translate-x-1/2 overflow-hidden text-xs font-bold whitespace-nowrap">
                    Agents Subscr
                  </div>
                </div>
              </div>
            </div>
            <div className="-mt-12 flex flex-col gap-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-lg py-0 text-lg font-semibold text-[#000000]`}
              >
                <span className="text-base font-[600]"> 1 NORMAL AD</span>
              </a>
            </div>
          </div>
          <div>
            {" "}
            <button
              className="mx-auto mt-6 flex w-[88px] justify-center rounded-lg bg-[#00BCFF] py-2 text-base font-bold text-white shadow-md transition-colors duration-200 hover:bg-[#1e4a70]"
              onClick={() => window.open(paymentLink, "_blank")}
            >
              BUY
            </button>
          </div>
        </div>
        {/* Card 3: Agents Subscription - New Design (with the SVG banner) */}
        <div className="relative flex w-full gap-3 rounded-lg border-1 border-[#e5e7eb] bg-white p-3 shadow-xl">
          <div className="relative shrink-0">
            <button
              className="block cursor-pointer rounded-lg bg-sky-400 px-15 py-10"
              type="button"
            >
              <div className="absolute inset-0 flex items-center justify-center rounded-md">
                <div className="px-2 text-center text-lg leading-5 font-bold text-white">
                  <h3>
                    150 <br className="gap-2 py-2" />
                    <span className="py-2"> KWD</span>
                  </h3>
                </div>
              </div>
            </button>
          </div>
          <div className="flex flex-grow flex-col justify-center">
            <div className="relative mb-3 flex h-[40px] items-center justify-center">
              <div className="absolute -top-[18px] left-1/2 -translate-x-1/2">
                <svg
                  width="143"
                  height="45"
                  viewBox="0 0 143 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.38 2.86L0.61 6.63L8.51 6.41L7.24 4.54L6.38 2.86Z"
                    fill="#242424"
                  />
                  <g filter="url(#filter0_d)">
                    <path
                      d="M131.9 27.42C131.5 30.26 129.16 32.42 126.3 32.58L29.66 38.1C26.5 38.28 23.52 36.57 22.08 33.75L6.29 2.88L135.46 2L131.9 27.42Z"
                      fill="#000000"
                    />
                  </g>
                  <path
                    d="M135.46 2L141.56 6.43L134.58 6.41L134.98 4.09L135.46 2Z"
                    fill="#242424"
                  />
                  <defs>
                    <filter
                      id="filter0_d"
                      x="2.29"
                      y="0"
                      width="137.16"
                      height="44.11"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="2" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
                <div className="absolute start-6 end-5 top-0 text-white">
                  <div className="absolute top-1.5 left-1/2 max-w-full -translate-x-1/2 overflow-hidden text-xs font-bold whitespace-nowrap">
                    <span className="text-sm font-[400]">Agents Subscr</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-lg py-0 text-lg font-semibold text-[#000000]`}
              >
                <span className="text-ce text-base font-[600]">
                  {" "}
                  30 ADS PREM
                </span>
              </a>
            </div>
          </div>

          <div>
            <button
              className="mx-auto mt-6 flex w-[88px] justify-center rounded-lg bg-[#00BCFF] py-2 text-base font-bold text-white shadow-md transition-colors duration-200 hover:bg-[#1e4a70]"
              onClick={() => window.open(paymentLink, "_blank")}
            >
              BUY
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 pb-4 text-center text-sm text-gray-700">
        <svg
          className="-mt-5 mr-1 h-6 w-6 flex-shrink-0 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p>{t.byCredit.allpaymentmethods}</p>
      </div>

      {showModal && modalImageSrc && (
        <div className="animate-fade-in fixed inset-0 z-10 flex items-center justify-center bg-black/10 p-4 backdrop-blur-[1px]">
          <div className="relative flex max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white pb-4 shadow-2xl">
            <img
              src={modalImageSrc}
              alt="Preview"
              className="h-full w-full max-w-sm rounded-2xl object-contain p-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/900x600/CCCCCC/000000?text=Image+Unavailable";
              }}
            />
            <div className="flex items-center justify-center">
              <button
                onClick={closeModal}
                className="flex items-center justify-center rounded-2xl bg-[#F5F7F9] p-2 px-6 text-gray-700"
              >
                {t.byCredit.closebutton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUpCard;
