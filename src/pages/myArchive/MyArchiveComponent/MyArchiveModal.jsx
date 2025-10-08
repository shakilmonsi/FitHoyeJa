// src/pages/my-archive/MyArchiveComponent/MyArchiveModal.jsx
import { useState, useEffect } from "react";
import { TfiAngleLeft } from "react-icons/tfi";
import { FiClock, FiEye, FiX, FiPhone, FiShare2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import FabController from "../../fab/FabController";
import { useLanguage } from "../../../context/LanguageContext";

// Optional (better date parsing if your API uses a strict format)
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const API_DATE_FMT = "DD MMM, YYYY hh:mm A"; // e.g., "17 Aug, 2025 09:58 AM"

/**
 * MyArchiveModal
 * - Displays archived/deleted ad details.
 * - No view increment here (read-only).
 */
export default function MyArchiveModal({ ad, show, onClose, t, isRTL }) {
  const [displayImage, setDisplayImage] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isLightboxActive, setIsLightboxActive] = useState(false);

  const { FloatingActionButton, language } = useLanguage();
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  // --- Helpers ---
  const coerceFile = (img) => (typeof img === "string" ? img : img?.file);
  const buildGallery = (adObj) => {
    const primary = adObj?.primary_image?.file
      ? [adObj.primary_image.file]
      : [];
    const rest = Array.isArray(adObj?.images)
      ? adObj.images.map(coerceFile).filter(Boolean)
      : [];
    const seen = new Set();
    return [...primary, ...rest].filter((src) =>
      seen.has(src) ? false : (seen.add(src), true),
    );
  };

  const gallery = buildGallery(ad);

  const priceNumber =
    ad?.price != null && !Number.isNaN(Number(ad.price))
      ? Number(ad.price)
      : ad?.kd != null && !Number.isNaN(Number(ad.kd))
        ? Number(ad.kd)
        : null;

  const priceLabel =
    priceNumber != null ? `KD ${priceNumber.toLocaleString()}` : null;

  const createdAt = ad?.created_at
    ? dayjs(ad.created_at, API_DATE_FMT, true)
    : ad?.postCreateAt
      ? dayjs(ad.postCreateAt)
      : null;

  const daysAgo =
    createdAt && createdAt.isValid() ? dayjs().diff(createdAt, "day") : null;

  // phone
  const phoneRaw = ad?.whatsapp || ad?.phone || ad?.user?.phone || "";
  const phoneDigits = (phoneRaw || "").toString().replace(/\D/g, "");
  const normalized = phoneDigits.startsWith("00")
    ? `+${phoneDigits.slice(2)}`
    : phoneDigits.startsWith("0")
      ? phoneDigits // local format
      : phoneDigits; // already intl or plain
  const telHref = phoneDigits ? `tel:${normalized}` : "#";
  const whatsappLink = phoneDigits
    ? `https://wa.me/${normalized.replace(/^\+/, "")}`
    : "#";

  // --- Effects: modal enter/exit ---
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => setIsModalActive(true), 5);
      return () => clearTimeout(timer);
    } else {
      setIsModalActive(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Lightbox enter/exit
  useEffect(() => {
    if (showLightbox) {
      const timer = setTimeout(() => setIsLightboxActive(true), 5);
      return () => clearTimeout(timer);
    } else {
      setIsLightboxActive(false);
    }
  }, [showLightbox]);

  // Initial display image
  useEffect(() => {
    if (gallery.length > 0) {
      setDisplayImage(gallery[0]);
    } else {
      setDisplayImage(
        "https://placehold.co/800x600/EBF4FF/333333?text=No+Image",
      );
    }
    // re-run when id or images change
  }, [ad?.id, ad?.primary_image?.file, ad?.images?.length]);

  if (!ad || !show) return null;

  const handleShareClick = async () => {
    const path = ad?.slug ? `/ads/${ad.slug}` : `/ads/${ad.id}`;
    const adUrl = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: ad.description,
          url: adUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(adUrl);
        alert(t?.ads?.linkCopied || "Link copied!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
        alert(t?.ads?.failedToCopy || "Copy failed.");
      }
    }
  };

  return (
    <>
      {/* Backdrop + Slide Panel */}
      <div
        className={`fixed inset-0 z-50 flex justify-start bg-black/60 transition-opacity duration-300 ease-in-out ${
          show
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      >
        <div
          className={`relative flex h-full w-full max-w-7xl transform flex-col bg-white transition-transform duration-300 ease-out ${
            isRTL
              ? isModalActive
                ? "translate-x-0"
                : "translate-x-full"
              : isModalActive
                ? "translate-x-0"
                : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <header className="border-primary-200 relative flex h-20 flex-shrink-0 items-center border-b px-4 py-4 sm:px-6">
            <button
              className={`text-primary-500 -m-2 cursor-pointer p-2 text-2xl ${isRTL ? "rotate-180" : ""}`}
              onClick={onClose}
            >
              <TfiAngleLeft />
            </button>
            <NavLink
              to="/"
              className="mx-auto flex items-center justify-center gap-2"
            >
              <img src="/logo.png" alt="Logo" className="w-18" />
              <div>
                <p className="text-lg font-bold capitalize">{t.site.name}</p>
                <p className="bg-primary-300 mx-auto w-fit rounded-md px-2 py-1 text-[8px] leading-normal text-white">
                  {t.site.tagline}
                </p>
              </div>
            </NavLink>
          </header>

          {/* Body */}
          <main className="flex-1 overflow-y-auto">
            {/* Title + Price + Meta */}
            <div className="bg-primary-600 flex flex-col items-center px-4 py-6 text-white sm:px-6">
              <h1 className="mt-4 text-center text-lg md:text-lg lg:text-2xl">
                {ad.title}
              </h1>

              {priceLabel && (
                <div className="mt-4 !text-lg font-[var(--font-bold)] sm:text-3xl">
                  {priceLabel} {t?.ads?.currency}
                </div>
              )}

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
                {daysAgo != null && daysAgo >= 0 && (
                  <div className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm">
                    <FiClock />
                    <span>
                      {daysAgo} {t?.common?.daysAgo ?? "Days ago"}
                    </span>
                  </div>
                )}
                <div className="bg-primary-300/30 flex items-center gap-1.5 rounded-full px-2 py-2 text-xs sm:text-sm">
                  <FiEye />
                  <span>{ad?.views ?? 0}</span>
                </div>
                <button
                  onClick={handleShareClick}
                  className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs transition-colors sm:text-sm"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mx-auto max-w-4xl">
              <p className="text-dark text-primary-900 mt-4 p-4 text-center text-base leading-relaxed font-[400] sm:p-6 md:text-base">
                {ad.description}
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center justify-center gap-3 px-4 pb-8 sm:flex-row">
              <a
                href={telHref}
                className="bg-success active:bg-active-success inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-base font-bold whitespace-nowrap text-white transition-colors select-none sm:w-auto"
              >
                <FiPhone className="text-xl" />
                <span className="text-base">
                  {phoneDigits || t?.common?.noPhone || "N/A"}
                </span>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  phoneDigits
                    ? "hover:bg-green-100"
                    : "pointer-events-none opacity-50"
                } bg-main flex h-12 w-full items-center justify-center rounded-lg border border-green-600 p-1 text-2xl text-green-600 transition-colors sm:w-12`}
              >
                <FaWhatsapp />
              </a>
            </div>

            {/* Gallery */}
            <div className="bg-gray-100 py-6 pb-[100px] sm:py-10 md:pb-[50px]">
              <div className="container mx-auto px-4">
                <div className="flex max-h-[60vh] justify-center">
                  {displayImage && (
                    <img
                      alt={ad.title}
                      className="max-h-full max-w-full cursor-pointer rounded-lg object-contain"
                      src={displayImage || "/placeholder.svg"}
                      onClick={() =>
                        gallery.length > 0 && setShowLightbox(true)
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/800x600/CCCCCC/000000?text=Image+Error";
                      }}
                    />
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-2 overflow-x-auto p-1">
                      {gallery.map((imgSrc, index) => (
                        <div
                          key={`${imgSrc}-${index}`}
                          className={`h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 sm:h-16 sm:w-16 ${
                            displayImage === imgSrc
                              ? "border-primary-500"
                              : "border-transparent"
                          }`}
                          onClick={() => setDisplayImage(imgSrc)}
                        >
                          <img
                            alt={`thumbnail ${index + 1}`}
                            className="h-full w-full object-cover"
                            src={imgSrc || "/placeholder.svg"}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/128x128/CCCCCC/000000?text=Thumb";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 sm:p-6"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <div
              className={`mx-auto w-full max-w-5xl transform transition-all duration-300 ease-out ${
                isLightboxActive
                  ? "scale-100 opacity-100"
                  : "scale-90 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex aspect-video h-auto max-h-[85vh] w-full items-center justify-center overflow-hidden rounded-md">
                <img
                  src={displayImage || "/placeholder.svg"}
                  alt="Lightbox"
                  className="h-auto max-h-full w-auto max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/1280x720/CCCCCC/000000?text=Image+Error";
                  }}
                />
              </div>
            </div>
            <button
              className="bg-primary-100/50 hover:bg-primary-100/80 absolute -top-4 -right-4 mt-2 mr-2 rounded-full p-2 text-2xl text-white transition-all"
              onClick={() => setShowLightbox(false)}
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {isMobile && FloatingActionButton && <FabController />}
    </>
  );
}
