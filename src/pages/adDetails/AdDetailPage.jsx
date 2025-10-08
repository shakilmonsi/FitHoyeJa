import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { FiClock, FiEye, FiX, FiShare2, FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

// ---- small helpers ----
const digitsOnly = (val) => (val || "").toString().replace(/\D/g, "");
const getDaysAgo = (dateStr) => {
  if (!dateStr) return 0;
  const post = new Date(dateStr);
  const now = new Date();
  const diff = now - post;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days < 0 ? 0 : days;
};

// Normalize any property/ad shape from API -> UI shape we need
const normalizeAd = (raw) => {
  if (!raw) return null;

  // build images: primary + others
  const primary = raw?.primary_image?.file ? [raw.primary_image.file] : [];
  const extras = Array.isArray(raw?.images)
    ? raw.images.map((i) => i.file)
    : [];
  const images = [...primary, ...extras];

  // whatsapp/phone fallback (company whatsapp_number, or property's user.phone)
  const waOrPhone =
    raw?.whatsapp_number || raw?.user?.phone || raw?.contact_phone || ""; // add more fallbacks if your API uses different keys

  return {
    id: raw.id,
    title: raw.title || "",
    description: raw.description || "",
    slug: raw.slug || "",
    kd: raw.price ?? raw.kd ?? "", // UI expects kd
    postCreateAt: raw.created_at || raw.postCreateAt || "",
    views: raw.views || 0,
    images: images.length
      ? images
      : ["https://placehold.co/800x600/EBF4FF/333333?text=No+Image"],
    whatsapp: waOrPhone,
  };
};

const fetchBySlug = async (slug) => {
  const tryEndpoints = [
    `/properties/${slug}`,
    `/properties/slug/${slug}`,
    `/properties?slug=${encodeURIComponent(slug)}`,
    `/ads/${slug}`,
  ];

  let lastError = null;

  for (const path of tryEndpoints) {
    try {
      const res = await axiosInstance.get(path);
      const data = res?.data?.data;

      if (!data) continue;

      if (!Array.isArray(data)) {
        const candidate = data.property || data;
        if (candidate?.slug?.toString() === slug || candidate?.slug === slug) {
          const normalized = normalizeAd(candidate);
          if (normalized) return normalized;
        }
        const normalized = normalizeAd(candidate);
        if (normalized && normalized.slug) return normalized;
        if (normalized) return normalized;
      }

      if (Array.isArray(data)) {
        const found =
          data.find((item) => item?.slug?.toString() === slug) || data[0];
        const normalized = normalizeAd(found);
        if (normalized) return normalized;
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Ad not found");
};

const AdDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRTL, language } = useLanguage();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayImage, setDisplayImage] = useState("");
  const [showLightbox, setShowLightbox] = useState(false);
  const [isLightboxActive, setIsLightboxActive] = useState(false);
  const [error, setError] = useState(null);

  // Web Share / Copy
  const handleShareClick = async (adToShare) => {
    const adUrl = `${window.location.origin}/ads/${adToShare.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: adToShare.title,
          text: adToShare.description,
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
        alert(t?.ads?.failedToCopy || "Failed to copy link");
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const normalized = await fetchBySlug(slug);
        if (!mounted) return;
        setAd(normalized);
        setDisplayImage(normalized.images?.[0] || "");
      } catch (err) {
        console.error("Ad fetch failed:", err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let timer;
    if (showLightbox) {
      timer = setTimeout(() => setIsLightboxActive(true), 5);
    } else {
      setIsLightboxActive(false);
    }
    return () => clearTimeout(timer);
  }, [showLightbox]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t?.common?.loading || "Loading..."}
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t?.ads?.notFound || "Ad not found"}
      </div>
    );
  }

  const waDigits = digitsOnly(ad.whatsapp);
  const whatsappLink = waDigits ? `https://wa.me/${waDigits}` : "";

  return (
    <>
      <div className="overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
        <div className="bg-primary-600 flex flex-col items-center rounded-b-lg px-4 py-6 text-white sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mt-2 text-center text-lg md:text-lg lg:text-2xl">
              {ad.title}
            </h1>
            <div className="mt-3 !text-lg font-[var(--font-bold)] sm:text-3xl">
              {ad.kd} {t?.ads?.currency || "KD"}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
            <div className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm">
              <FiClock />
              <span>
                {getDaysAgo(ad.postCreateAt)}{" "}
                {getDaysAgo(ad.postCreateAt) === 1
                  ? t?.ads?.day || "Day"
                  : t?.ads?.days || "Days"}
              </span>
            </div>

            <div className="bg-primary-300/30 flex items-center gap-1.5 rounded-full px-2 py-2 text-xs sm:text-sm">
              <FiEye />
              <span>{ad.views}</span>
            </div>

            <button
              onClick={() => handleShareClick(ad)}
              className="bg-primary-300/30 hover:bg-primary-500 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs transition-colors sm:text-sm"
            >
              <FiShare2 />
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="text-dark text-primary-900 mt-4 p-4 text-center text-base leading-relaxed font-[400] sm:p-6 md:text-base">
            {ad.description}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row">
          {waDigits && (
            <>
              <a
                href={`tel:${waDigits}`}
                className="bg-success active:bg-active-success inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 text-base font-bold whitespace-nowrap text-white transition-colors select-none sm:w-auto"
              >
                <FiPhone className="text-xl" />
                <span className="text-lg font-normal">{waDigits}</span>
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-main flex h-12 w-full items-center justify-center rounded-lg border border-green-600 p-1 text-2xl text-green-600 transition-colors hover:bg-green-100 sm:w-12"
              >
                <FaWhatsapp />
              </a>
            </>
          )}
        </div>

        <div className="py-8 sm:py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="main-image-container flex max-h-[70vh] justify-center">
              {displayImage && (
                <img
                  alt={ad.title}
                  className="max-h-full max-w-full cursor-pointer rounded-lg object-contain"
                  src={displayImage || "/placeholder.svg"}
                  onClick={() => setShowLightbox(true)}
                />
              )}
            </div>

            {ad.images && ad.images.length > 1 && (
              <div className="mt-4 flex justify-center">
                <div className="flex gap-2 overflow-x-auto p-1">
                  {ad.images.map((imgSrc, index) => (
                    <div
                      key={index}
                      className={`h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 ${
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
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 ease-in-out sm:p-6"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className={`relative w-full max-w-5xl transform transition-all duration-300 ease-out ${
              isLightboxActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex aspect-video h-auto max-h-[85vh] w-full items-center justify-center overflow-hidden rounded-md">
              <img
                src={displayImage || "/placeholder.svg"}
                alt="Lightbox"
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            </div>
            <button
              className="absolute top-0 -right-0 mt-2 mr-2 rounded-full bg-black/50 p-2 text-2xl text-white transition-all duration-200 hover:bg-black/80 sm:-top-4 sm:-right-4"
              onClick={() => setShowLightbox(false)}
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdDetailPage;
