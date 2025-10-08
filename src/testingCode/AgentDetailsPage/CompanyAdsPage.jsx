// src/components/pages/CompanyAdsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiClock, FiPhone, FiDownload } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaPlayCircle } from "react-icons/fa";

import { useLanguage } from "../../context/LanguageContext";
import axiosInstance from "../../utils/axiosInstance";

import AdDetailsModal from "../AdDetailsModal";
import {
  digitsOnly,
  normalizeSocialLinks,
  getDaysAgo,
  plural,
  generateSlug,
} from "../../context/utils/social";

/* ---------------- media helpers (image/video/file) ---------------- */
const IMG_EXTS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
  "tiff",
  "tif",
  "ico",
];
const VID_EXTS = [
  "mp4",
  "webm",
  "ogv",
  "mov",
  "avi",
  "wmv",
  "flv",
  "mkv",
  "3gp",
  "ts",
  "mpg",
  "mpeg",
  "vob",
];

const guessMimeFromExt = (ext) => {
  const e = (ext || "").toLowerCase();
  const imageMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    webp: "image/webp",
    tiff: "image/tiff",
    tif: "image/tiff",
    ico: "image/x-icon",
  };
  const videoMap = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogv: "video/ogg",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    wmv: "video/x-ms-wmv",
    flv: "video/x-flv",
    mkv: "video/x-matroska",
    "3gp": "video/3gpp",
    ts: "video/mp2t",
    mpg: "video/mpeg",
    mpeg: "video/mpeg",
    vob: "video/dvd",
  };
  if (imageMap[e]) return imageMap[e];
  if (videoMap[e]) return videoMap[e];
  return "";
};

const resolveMediaKind = (media) => {
  if (!media) return { kind: "file", url: "", mime: "", ext: "", filename: "" };
  const url =
    typeof media === "string" ? media : media?.url || media?.file || "";
  const filename =
    (typeof media === "object" && (media?.name || media?.filename)) ||
    (url ? url.split("?")[0].split("/").pop() : "") ||
    "";
  const ext = (filename.split(".").pop() || "").toLowerCase();
  const mime =
    (typeof media === "object" && media?.mime) || guessMimeFromExt(ext);

  const isImage = (mime && mime.startsWith("image/")) || IMG_EXTS.includes(ext);
  const isVideo = (mime && mime.startsWith("video/")) || VID_EXTS.includes(ext);

  let kind = "file";
  if (isImage) kind = "image";
  else if (isVideo) kind = "video";

  return { kind, url, mime, ext, filename };
};

/* ---------------- Component ---------------- */
export default function CompanyAdsPage() {
  const { companyId } = useParams();
  const { isRTL, t, language } = useLanguage();

  const [company, setCompany] = useState(null);
  const [companyAds, setCompanyAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/agents/${companyId}`);
        if (!mounted) return;

        const agentData = res?.data?.data;
        if (!agentData) {
          setCompany(null);
          setCompanyAds([]);
          return;
        }

        // Normalize company data
        const social = normalizeSocialLinks(agentData.social_links);
        const companyWhatsApp =
          agentData.whatsapp_number || agentData.user?.phone || "";

        const normalizedCompany = {
          id: agentData.id,
          name: agentData.company_name || agentData.user?.name || "—",
          company_description: agentData.company_description || "",
          image: agentData.image || "",
          website: agentData.website || "",
          social_links: {
            ...social,
            whatsapp: social.whatsapp || companyWhatsApp,
          },
        };
        setCompany(normalizedCompany);

        // Process properties (ads)
        const rawProps = Array.isArray(agentData.user?.properties)
          ? agentData.user.properties
          : [];

        const adsWithSlugs = rawProps.map((p) => {
          // collect *all* media (image/video) into one list
          const primary = p.primary_image?.file
            ? [
                {
                  url: p.primary_image.file,
                  name: p.primary_image?.name,
                  mime: p.primary_image?.mime,
                },
              ]
            : [];

          const extras = Array.isArray(p.images)
            ? p.images
                .map((i) => ({
                  url: i?.file || i?.url,
                  name: i?.name,
                  mime: i?.mime,
                }))
                .filter((m) => m.url)
            : [];

          // if backend has a generic files/media array, include them too
          const more = Array.isArray(p.files)
            ? p.files
                .map((f) => ({
                  url: f?.file || f?.url,
                  name: f?.name,
                  mime: f?.mime,
                }))
                .filter((m) => m.url)
            : [];

          const media = [...primary, ...extras, ...more];
          const fallback = {
            url: "https://placehold.co/800x600/EBF4FF/333333?text=No+Preview",
          };

          return {
            id: p.id,
            title: p.title,
            description: p.description,
            slug: p.slug || generateSlug(p.title),
            kd: p.price,
            postCreateAt: p.created_at,
            views: p.views || 0,
            // keep old images for backward-compat (some components may use it)
            images: media.length ? media.map((m) => m.url) : [fallback.url],
            // new media array with objects (image/video/other)
            media: media.length ? media : [fallback],
            whatsapp: companyWhatsApp,
          };
        });

        setCompanyAds(adsWithSlugs);
      } catch (e) {
        setError(e);
        setCompany(null);
        setCompanyAds([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [companyId]);

  const handleAdClick = async (ad) => {
    try {
      await axiosInstance.post(`/properties/view/${ad.id}`);

      const updatedAds = companyAds.map((currentAd) =>
        currentAd.id === ad.id
          ? { ...currentAd, views: (currentAd.views || 0) + 1 }
          : currentAd,
      );
      setCompanyAds(updatedAds);

      setSelectedAd(ad);
      setShowAdModal(true);
    } catch (error) {
      console.error("Failed to update view count:", error);
    }
  };

  const closeAdModal = () => {
    setShowAdModal(false);
    setTimeout(() => setSelectedAd(null), 300);
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error)
    return (
      <div className="py-10 text-center text-red-500">Error loading data.</div>
    );
  if (!company)
    return <div className="py-10 text-center">Agent not found.</div>;

  const waDigits = digitsOnly(company.social_links?.whatsapp);
  const whatsappHref = waDigits ? `https://wa.me/${waDigits}` : "";

  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined) return "";
    return parseFloat(number).toLocaleString("en-US");
  };
  return (
    <>
      {/* Company Header */}
      <section className="bg-primary-700 text-on-primary py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 flex h-34 w-34 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
            {company.image ? (
              <img
                src={company.image}
                alt={company.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">🏢</span>
            )}
          </div>

          <h4 className="text-2xl font-bold text-white sm:text-lg">
            {company.name}
          </h4>
          <p className="mx-auto mt-2 px-2 text-center text-[14px] font-bold text-white lg:px-70">
            {company.company_description}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {waDigits && (
              <>
                <a
                  href={`tel:${waDigits}`}
                  className="text-on-success inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#38A854] px-6 text-base font-bold text-white transition-colors select-none"
                >
                  <FiPhone className={`text-xl ${isRTL ? "rotate-265" : ""}`} />
                  <span className="text-lg font-normal">{waDigits}</span>
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-primary-100 flex h-12 w-12 items-center justify-center rounded-lg border border-[#38A854] bg-white p-1 text-2xl text-[#38A854] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaWhatsapp />
                </a>
              </>
            )}

            {company.social_links?.instagram && (
              <a
                href={company.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-primary-100 flex h-12 w-12 items-center justify-center rounded-lg border bg-white p-1 text-2xl transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="Instagram"
              >
                <FaInstagram />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Ads List */}
      <section className="bg-gray-50 pb-[100px] sm:py-10 md:py-16 md:pb-[50px]">
        <div className="container mx-auto px-4">
          <div className="mx-auto w-full max-w-3xl">
            <h3 className="mb-6 px-2 pt-3 text-base font-[700] text-gray-800">
              {t?.agent?.companystTitle || "Company Ads"} ({companyAds.length}{" "}
              {t?.ads?.adsCount || "ads"})
            </h3>

            <div className="flex flex-col items-center justify-start gap-4">
              {companyAds.length > 0 ? (
                companyAds.map((ad) => {
                  const days = getDaysAgo(ad.postCreateAt);
                  const firstMedia =
                    (ad.media && ad.media[0]) ||
                    (ad.images && ad.images[0]) ||
                    "";
                  const meta = resolveMediaKind(firstMedia);
                  const thumbUrl =
                    meta.url ||
                    "https://placehold.co/112x112/EBF4FF/333333?text=Ad";

                  return (
                    <div
                      key={ad.id}
                      onClick={() => handleAdClick(ad)}
                      className="group w-full cursor-pointer"
                    >
                      <div className="relative w-full rounded-lg border border-gray-200 bg-white p-3 shadow sm:p-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Thumbnail with media detection */}
                          <div className="relative flex-shrink-0">
                            <div className="relative flex aspect-square h-28 w-28 items-center justify-center overflow-hidden rounded-md md:h-14 md:w-14 xl:h-28 xl:w-28">
                              {meta.kind === "video" ? (
                                <div className="relative h-full w-full">
                                  <video
                                    className="h-full w-full object-cover"
                                    preload="metadata"
                                    controls={false}
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
                                  >
                                    {meta.mime ? (
                                      <source src={thumbUrl} type={meta.mime} />
                                    ) : (
                                      <source src={thumbUrl} />
                                    )}
                                  </video>
                                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="rounded-full bg-white/95 p-0.5">
                                      <FaPlayCircle className="h-6 w-6 text-[#1A96D0]" />
                                    </div>
                                  </div>
                                </div>
                              ) : meta.kind === "image" ? (
                                <img
                                  alt={ad.title}
                                  src={thumbUrl}
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://placehold.co/112x112/CCCCCC/000000?text=No+Image";
                                  }}
                                />
                              ) : (
                                // other file types: badge + download
                                <div className="flex h-full w-full flex-col items-center justify-center bg-[#F3F6F9] p-2 text-center">
                                  <div className="text-[10px] font-semibold text-gray-700 uppercase">
                                    {meta.ext || "FILE"}
                                  </div>
                                  <a
                                    href={thumbUrl}
                                    onClick={(e) => e.stopPropagation()}
                                    download={meta.filename || undefined}
                                    className="mt-1 inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-medium text-gray-700 shadow"
                                    title="Download"
                                  >
                                    <FiDownload className="h-3 w-3" />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-dark font-primary line-clamp-2 text-[15px] font-[700] break-words">
                              {ad.title}
                            </h4>

                            <div className="font-primary mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                              <div className="text-primary-900 py-1 text-sm font-[700]">
                                {formatNumberWithCommas(Math.round(ad.kd)) ||
                                  "KD"}
                                {t.ads.currency}
                              </div>

                              <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm">
                                <FiClock />
                                <span>
                                  {days}{" "}
                                  {plural(
                                    days,
                                    t?.ads?.day || "Day",
                                    t?.ads?.days || "Days",
                                  )}
                                </span>
                              </div>
                            </div>

                            <p className="font-primary text-primary-900 mt-2 line-clamp-2 text-sm font-[400]">
                              {ad.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="font-primary text-center text-gray-600">
                  {t?.agent?.noAds || "No ads found for this agent."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AdDetailsModal
        show={showAdModal}
        onClose={closeAdModal}
        ad={selectedAd}
        t={t}
        isRTL={isRTL}
        language={language}
        formatTimeAgo={(d) => d}
      />
    </>
  );
}
