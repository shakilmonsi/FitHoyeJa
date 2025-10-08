import React, { useState, useEffect } from "react";
import { TfiAngleLeft } from "react-icons/tfi";
import { FiClock, FiEye, FiX, FiPhone, FiShare2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FabController from "../fab/FabController";
import { useLanguage } from "../../context/LanguageContext";
import { RiPhoneFill } from "react-icons/ri";

dayjs.extend(customParseFormat);

/** API created_at format: "17 Aug, 2025 09:58 AM" */
const API_DATE_FMT = "DD MMM, YYYY hh:mm A";

/* ================== Shared Media Helpers (standalone) ================== */
const VIDEO_PLAYABLE_EXT = ["mp4", "webm", "ogg"];

const getExt = (url = "") => {
  try {
    const clean = url.split("?")[0].split("#")[0];
    const parts = clean.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  } catch {
    return "";
  }
};

const isBrowserPlayableVideo = (mime, url) => {
  if (mime?.startsWith?.("video/")) return true;
  const ext = getExt(url);
  return VIDEO_PLAYABLE_EXT.includes(ext);
};

// accepts string URL OR {file, mime_type}
const resolveMediaKind = (media) => {
  const file = typeof media === "string" ? media : media?.file;
  const mime = typeof media === "string" ? "" : media?.mime_type || "";
  if (!file) return { kind: "placeholder", url: "" };

  if (isBrowserPlayableVideo(mime, file))
    return { kind: "video", url: file, mime };
  if (mime?.startsWith("image/")) return { kind: "image", url: file };

  const ext = getExt(file);
  if (
    ["jpeg", "jpg", "png", "gif", "bmp", "svg", "webp", "tiff", "ico"].includes(
      ext,
    )
  )
    return { kind: "image", url: file };

  return { kind: "unknown", url: file, mime };
};

// Build a gallery where primary comes first, then the rest (dedup by url)
const buildGallery = (ad) => {
  const primary = ad?.primary_image ? [ad.primary_image] : [];
  const others = Array.isArray(ad?.images) ? ad.images : [];

  const merged = [...primary, ...others]
    .map(resolveMediaKind)
    .filter((m) => m?.url);

  const seen = new Set();
  const deduped = [];
  for (const m of merged) {
    if (!seen.has(m.url)) {
      seen.add(m.url);
      deduped.push(m);
    }
  }
  return deduped.length
    ? deduped
    : [
        {
          kind: "placeholder",
          url: "https://placehold.co/800x600/EBF4FF/333333?text=No+Media",
        },
      ];
};
/* ====================================================================== */

export default function MyArchiveModal({ ad, show, onClose, t, isRTL }) {
  const [displayMedia, setDisplayMedia] = useState({
    kind: "placeholder",
    url: "",
  });
  const [showLightbox, setShowLightbox] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isLightboxActive, setIsLightboxActive] = useState(false);

  const { FloatingActionButton, language } = useLanguage();
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  // ---- i18n-safe helpers (fallback সহ) ----
  const getDaysLabel = (n) =>
    n === 1 ? (t?.ads?.day ?? "Day") : (t?.ads?.days ?? "Days");
  const getAgoLabel = () => t?.ads?.ago ?? "ago";
  const getTodayLabel = () => t?.ads?.today ?? "Today";

  const getDaysDiff = (dateStr) => {
    const post = dayjs(dateStr, API_DATE_FMT, true);
    if (!post.isValid()) return null;
    const now = dayjs();
    return now.startOf("day").diff(post.startOf("day"), "day");
  };

  const getDaysAgoText = (dateStr) => {
    const diff = getDaysDiff(dateStr);
    if (diff === null) return "";
    if (diff === 0) return getTodayLabel();
    return `${diff} ${getDaysLabel(diff)} ${getAgoLabel()}`;
  };

  const formatTimeAgo = (dateString, lang) => {
    const post = dayjs(dateString, API_DATE_FMT, true);
    if (!post.isValid()) return "";
    const seconds = dayjs().diff(post, "second");
    const hours = Math.floor(seconds / 3600);
    if (hours < 1) {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 1) return lang === "ar" ? "الآن" : "just now";
      return `${minutes} ${lang === "ar" ? "دقيقة" : "minutes"}`;
    }
    return `${hours} ${lang === "ar" ? "ساعة" : "hours"}`;
  };

  // ---- Modal enter/exit ----
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

  // ---- Lightbox enter/exit ----
  useEffect(() => {
    if (showLightbox) {
      const timer = setTimeout(() => setIsLightboxActive(true), 5);
      return () => clearTimeout(timer);
    } else {
      setIsLightboxActive(false);
    }
  }, [showLightbox]);

  // ---- Build gallery + initial display media ----
  const gallery = buildGallery(ad);

  useEffect(() => {
    if (ad && gallery.length > 0) {
      // primary = gallery[0] — same as card
      setDisplayMedia(gallery[0]);
    } else {
      setDisplayMedia({
        kind: "placeholder",
        url: "https://placehold.co/800x600/EBF4FF/333333?text=No+Media",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad]);

  if (!ad || !show) return null;

  // Fix: Use ad.user.phone instead of ad.whatsapp
  const phoneNumber = ad.user?.phone || "";
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${cleanPhoneNumber}`;

  const handleShareClick = async () => {
    const adUrl = `${window.location.origin}/ads/${ad.id}`;

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
        alert(t?.ads?.failedToCopy || "Failed to copy.");
      }
    }
  };

  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined) return "";
    return parseFloat(number).toLocaleString("en-US");
  };

  const openLightbox = (media) => {
    setDisplayMedia(media);
    setShowLightbox(true);
  };

  return (
    <>
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
              className={`text-primary-500 -m-2 cursor-pointer p-2 text-2xl ${
                isRTL ? "rotate-180" : ""
              }`}
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
                <p className="text-lg font-bold capitalize">
                  {t?.site?.name ?? "Site"}
                </p>
                <p className="bg-primary-300 mx-auto w-fit rounded-md px-2 py-1 text-[8px] leading-normal text-white">
                  {t?.site?.tagline ?? ""}
                </p>
              </div>
            </NavLink>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="bg-primary-600 flex flex-col items-center px-4 py-6 text-white sm:px-6">
              <h1 className="mt-4 text-center text-lg md:text-lg lg:text-2xl">
                {ad.title}
              </h1>

              <div className="mt-4 !text-lg font-[var(--font-bold)] sm:text-3xl">
                {formatNumberWithCommas(Math.round(ad.price))} {t.ads.currency}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
                <div className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm">
                  <FiClock />
                  {(() => {
                    const d = getDaysDiff(ad.created_at);
                    if (d === null) return <span></span>;
                    if (d === 0) return <span>{t?.ads?.today ?? "Today"}</span>;
                    return <span>{`${d} ${getDaysLabel(d)}`}</span>;
                  })()}
                </div>

                <div className="bg-primary-300/30 flex items-center gap-1.5 rounded-full px-2 py-2 text-xs sm:text-sm">
                  <FiEye />
                  <span>{ad.views}</span>
                </div>

                <button
                  onClick={handleShareClick}
                  className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs transition-colors sm:text-sm"
                >
                  <FiShare2 />
                </button>
              </div>
            </div>

            <div className="mx-auto max-w-4xl">
              <p className="text-dark mt-4 p-4 text-center text-base leading-relaxed sm:p-6 md:text-base">
                {ad.description}
              </p>
            </div>

            {/* Fix: Use ad.user.phone and add proper validation */}
            <div className="flex flex-col items-center justify-center gap-3 px-4 pb-8 sm:flex-row">
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="bg-success text-on-success active:bg-active-success inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#38A854] px-6 text-base font-bold whitespace-nowrap text-white transition-colors select-none sm:w-auto"
                >
                  <RiPhoneFill
                    className={`text-xl font-bold ${isRTL ? "rotate-265" : ""}`}
                  />
                  <span className="m-0 p-0 text-lg font-normal">
                    {phoneNumber}
                  </span>
                </a>
              )}

              {phoneNumber && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-primary-100 flex h-12 w-12 items-center justify-center rounded-lg border-1 border-[#38A854] bg-white p-1 text-2xl text-[#38A854] transition-colors"
                >
                  <FaWhatsapp />
                </a>
              )}
            </div>

            {/* ======= Main Media Viewer ======= */}
            <div className="bg-gray-100 py-6 pb-[100px] sm:py-10 md:pb-[50px]">
              <div className="container mx-auto px-4">
                <div className="flex max-h-[60vh] justify-center">
                  {displayMedia?.kind === "video" ? (
                    <video
                      key={displayMedia.url}
                      className="max-h-full max-w-full cursor-pointer rounded-lg object-contain"
                      src={displayMedia.url}
                      preload="metadata"
                      playsInline
                      muted
                      controls
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLightbox(true);
                      }}
                    >
                      <source
                        src={displayMedia.url}
                        type={displayMedia.mime || undefined}
                      />
                      <source src={displayMedia.url} />
                    </video>
                  ) : (
                    <img
                      alt={ad.title}
                      className="max-h-full max-w-full cursor-pointer rounded-lg object-contain"
                      src={displayMedia?.url || "/placeholder.svg"}
                      onClick={() => openLightbox(displayMedia)}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/800x600/EBF4FF/333333?text=No+Media";
                      }}
                    />
                  )}
                </div>

                {/* ======= Thumbnails / Gallery ======= */}
                {gallery.length > 1 && (
                  <div className="mt-4 flex justify-center">
                    <div className="flex gap-2 overflow-x-auto p-1">
                      {gallery.map((m, index) => {
                        const active = displayMedia?.url === m.url;
                        return (
                          <div
                            key={index}
                            className={`relative h-14 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 sm:h-16 sm:w-16 ${
                              active
                                ? "border-primary-500"
                                : "border-transparent"
                            }`}
                            onClick={() => setDisplayMedia(m)}
                            title={m.kind === "video" ? "Video" : "Image"}
                          >
                            {m.kind === "video" ? (
                              <>
                                <video
                                  className="h-full w-full object-cover"
                                  src={m.url}
                                  preload="metadata"
                                  playsInline
                                  muted
                                  onMouseEnter={(e) => {
                                    try {
                                      e.currentTarget.play();
                                    } catch {}
                                  }}
                                  onMouseLeave={(e) => {
                                    try {
                                      e.currentTarget.pause();
                                      e.currentTarget.currentTime = 0;
                                    } catch {}
                                  }}
                                />
                                <div className="pointer-events-none absolute right-1 bottom-1 rounded bg-black/55 px-1 text-[9px] font-semibold text-white">
                                  VIDEO
                                </div>
                              </>
                            ) : (
                              <img
                                alt={`thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                                src={m.url || "/placeholder.svg"}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/64x64/CCCCCC/000?text=NA";
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ======= Lightbox ======= */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 transition-opacity duration-300"
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
              <div className="flex h-[85vh] w-full items-center justify-center overflow-hidden">
                {displayMedia?.kind === "video" ? (
                  <video
                    key={displayMedia.url}
                    className="h-full w-full object-contain"
                    src={displayMedia.url}
                    controls
                    playsInline
                    preload="metadata"
                    autoPlay
                  >
                    <source
                      src={displayMedia.url}
                      type={displayMedia.mime || undefined}
                    />
                    <source src={displayMedia.url} />
                  </video>
                ) : (
                  <img
                    src={displayMedia?.url || "/placeholder.svg"}
                    alt="Lightbox"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/800x600/EBF4FF/333333?text=No+Media";
                    }}
                  />
                )}
              </div>
            </div>

            <button
              className="bg-primary-100/50 hover:bg-primary-100/80 absolute top-4 right-4 z-10 rounded-full p-2 text-2xl text-white transition-all md:top-8 md:right-8"
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
