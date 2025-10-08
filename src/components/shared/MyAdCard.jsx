import React, { useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiTwitterLogoBold } from "react-icons/pi";
import { BsTranslate } from "react-icons/bs";
import { FiClock, FiEye, FiX } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiagonalRibbon from "../DiagonalRibbon";
import { useLanguage } from "../../context/LanguageContext";
import axiosInstance from "../../utils/axiosInstance";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { FaPlay, FaPlayCircle } from "react-icons/fa";
dayjs.extend(customParseFormat);
// ======================code bay shakil munshi =========================
/**  API-র created_at herslsn "17 Aug, 2025 09:58 AM" */
// ========================================================================

const API_DATE_FMT = "DD MMM, YYYY hh:mm A";

// ======================code bay shakil munshi =========================
/* ---------------- helpers ---------------- */
// ========================================================================
const fmtPrice = (price) => {
  const n = price != null ? Number(price) : null;
  if (n == null || Number.isNaN(n)) return null;
  return `KD ${n.toLocaleString()}`;
};

const getPrimaryMedia = (ad) =>
  ad?.primary_image || (Array.isArray(ad?.images) && ad.images[0]) || null;

const statusStyle = (statusLabel, t) => {
  const open = t?.myAds?.open || "Open";
  const archived = t?.myAds?.archive || "Archived";
  const deleted = t?.myAds?.deleted || "Deleted";
  const map = {
    Open: { text: open, bg: "#556895" },
    Archived: { text: archived, bg: "#556885" },
    Deleted: { text: deleted, bg: "#242424" },
    Sold: { text: "Sold", bg: "#3A7D44" },
    Expired: { text: "Expired", bg: "#8A1C1C" },
    Pending: { text: "Pending", bg: "#9E7B00" },
  };
  return map[statusLabel] || { text: statusLabel || open, bg: "#556895" };
};

// ======================code bay shakil munshi =========================
/* ---------- media helpers: image/video/placeholder resolve ---------- */
// ========================================================================
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
  if (mime?.startsWith("video/")) return true;
  const ext = getExt(url);
  return VIDEO_PLAYABLE_EXT.includes(ext);
};

const resolveMediaKind = (media) => {
  const file = media?.file;
  const mime = media?.mime_type || "";
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

// ======================code bay shakil munshi =========================
/**  API- created_at herslsn "17 Aug, 2025 09:58 AM" */
// ========================================================================
const MyAdCard = ({ ad, onClick, showRenew, onAdUpdated, onAdDeleted }) => {
  const { isRTL, t, language } = useLanguage();

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggle = (setter) => setter((s) => !s);
  const handleCardClick = () => onClick?.(ad);

  const primaryMedia = getPrimaryMedia(ad);
  const mediaMeta = resolveMediaKind(primaryMedia);
  const mediaUrl =
    mediaMeta.url || "https://placehold.co/224x224/EBF4FF/333333?text=Ad";

  const priceLabel = fmtPrice(ad?.price);

  const createdAt = ad?.created_at
    ? dayjs(ad.created_at, API_DATE_FMT, true)
    : null;
  const daysAgo =
    createdAt && createdAt.isValid() ? dayjs().diff(createdAt, "day") : null;

  const stat = statusStyle(ad?.status_label, t);

  const handleDeleteAd = async () => {
    try {
      const response = await axiosInstance.delete(
        `/properties/destroy/${ad.id}`,
      );
      if (response.status === 200) {
        toast.success(
          t?.myAds?.deleteSuccessMessage || "Ad deleted successfully!",
        );
        setShowRenewModal(false);
        onAdDeleted?.(ad.id);
      } else {
        throw new Error(response.data?.message || "Failed to delete ad.");
      }
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error(
        error.message || "Failed to delete ad. Please try again later.",
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="shadow-card-shadow relative w-full cursor-pointer rounded-lg border border-transparent bg-white p-3 xl:p-4">
        <DiagonalRibbon text={stat.text} backgroundColor={stat.bg} />

        <div
          className="absolute inset-0 z-[1] rounded-lg bg-transparent"
          onClick={handleCardClick}
        />

        <div className="flex gap-3">
          <div className="relative">
            <div className="relative size-14 flex-shrink-0 overflow-hidden rounded-md xl:size-28">
              {(() => {
                if (mediaMeta.kind === "video") {
                  return (
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
                      <source
                        src={mediaMeta.url}
                        type={mediaMeta.mime || undefined}
                      />
                      <source src={mediaMeta.url} />
                    </video>
                  );
                }
                if (mediaMeta.kind === "image") {
                  return (
                    <img
                      alt={ad?.title || "Ad"}
                      src={mediaMeta.url}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/224x224/CCCCCC/000000?text=No+Image";
                      }}
                    />
                  );
                }
                return (
                  <img
                    alt="No Preview"
                    src="https://placehold.co/224x224/EBF4FF/333333?text=Ad"
                    className="h-full w-full object-cover"
                  />
                );
              })()}
            </div>

            {mediaMeta.kind === "video" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-[#FFF] text-[10px] font-semibold">
                  <FaPlayCircle className="h-6 w-6 text-[#1A96D0]" />
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden pe-6">
            <div className="line-clamp-2 font-[700] break-words">
              {ad?.title}
            </div>

            <div className="h-0.5" />

            <div className="flex items-center gap-3">
              {priceLabel && <h3 className="text-primary-900">{priceLabel}</h3>}

              {daysAgo != null && daysAgo >= 0 && (
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm">
                  <FiClock />
                  <span>
                    {daysAgo} {t?.common?.daysAgo ?? "Days ago"}
                  </span>
                </div>
              )}

              <div className="text-primary-900 flex items-center gap-1 text-xs">
                <FiEye />
                <div className="text-xs">{ad?.views ?? 0}</div>
              </div>
            </div>

            <div className="text-primary-900 mt-2 line-clamp-2 hidden text-sm font-[400] lg:block">
              {ad?.description}
            </div>
          </div>
        </div>

        <div className="text-primary-900 mt-2 line-clamp-2 text-sm font-[400] lg:hidden">
          {ad?.description}
        </div>

        <div className="h-4" />

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(setShowEditModal);
            }}
            className="text-on-primary relative z-[2] inline-flex items-center justify-center rounded-lg bg-transparent p-0"
            title={t?.myAds?.editAdTitle || "Edit"}
          >
            <div className="relative z-50 flex h-6 w-6 items-center justify-center rounded bg-[#F5E0D8]">
              <MdOutlineEdit className="text-[#EE792B]" />
            </div>
          </button>

          {showRenew && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggle(setShowRenewModal);
              }}
              className="text-on-primary relative z-[2] inline-flex items-center justify-center rounded-lg bg-transparent p-0"
              title={t?.myAds?.deletebutton || "Delete"}
            >
              <div className="relative flex h-6 w-6 items-center justify-center rounded bg-[#E9E3E7]">
                <RiDeleteBin6Line className="text-[#8895A5]" />
              </div>
            </button>
          )}

          <a
            href={ad?.twitter || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-on-primary relative z-[2] inline-flex items-center justify-center rounded-lg bg-transparent p-0"
            title="Twitter"
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded bg-[#D8E6F0]">
              <PiTwitterLogoBold className="text-[#1A96D0]" />
            </div>
          </a>

          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(setShowTranslateModal);
            }}
            className="text-on-primary relative z-[2] inline-flex items-center justify-center rounded-lg bg-transparent p-0"
            title={t?.myAds?.translate || "Translate"}
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded bg-[#E8E2EB]">
              <BsTranslate className="text-[#8488C2]" />
            </div>
          </button> */}
        </div>
      </div>

      {/* Renew/Delete Modal */}
      {showRenewModal &&
        renewModal({
          ad,
          handleOpenRenewModal: () => toggle(setShowRenewModal),
          t,
          handleDeleteAd,
        })}

      {/* Edit Modal */}
      {showEditModal && (
        <EditModal
          ad={ad}
          handleCloseEditModal={() => toggle(setShowEditModal)}
          onAdUpdated={onAdUpdated}
          t={t}
        />
      )}

      {showTranslateModal &&
        translateModal({
          ad,
          handleOpenTranslateModal: () => toggle(setShowTranslateModal),
          t,
          language,
          isRTL,
        })}
    </>
  );
};

function EditModal({ ad, handleCloseEditModal, onAdUpdated, t }) {
  const initialMedia = getPrimaryMedia(ad);
  const initialMeta = resolveMediaKind(initialMedia);

  const [editedTitle, setEditedTitle] = useState(ad.title);
  const [editedDescription, setEditedDescription] = useState(ad.description);
  const [editedPrice, setEditedPrice] = useState(ad.price || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const [filePreviewUrl, setFilePreviewUrl] = useState(
    initialMeta.url ||
      "https://placehold.co/128x128/CCCCCC/000000?text=No+Preview",
  );
  const [filePreviewKind, setFilePreviewKind] = useState(initialMeta.kind); // "video" | "image" | ...

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setFilePreviewUrl(URL.createObjectURL(file));
        setFilePreviewKind("image");
      } else if (file.type.startsWith("video/")) {
        // থাম্বের জন্য ভিডিও প্রিভিউতে জেনেরিক লেবেল
        setFilePreviewUrl(URL.createObjectURL(file)); // চাইলে poster জেনারেট করতে পারেন
        setFilePreviewKind("video");
      } else {
        setFilePreviewUrl(
          "https://placehold.co/128x128/CCCCCC/000000?text=File+Selected",
        );
        setFilePreviewKind("unknown");
      }
    } else {
      setSelectedFile(null);
      setFilePreviewUrl(
        initialMeta.url ||
          "https://placehold.co/128x128/CCCCCC/000000?text=No+Preview",
      );
      setFilePreviewKind(initialMeta.kind);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", ad.category_id);
    formData.append("property_type_id", ad.property_type_id);
    formData.append("area_id", ad.area_id);
    formData.append("description", editedDescription);
    formData.append("price", editedPrice);
    formData.append("status", ad.status);

    if (selectedFile) {
      formData.append("primary_file", selectedFile);
      formData.append("files[]", selectedFile);
    }

    try {
      const response = await axiosInstance.post(
        `/properties/update/${ad.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data?.success) {
        const updatedAd = {
          ...ad,
          title: editedTitle,
          description: editedDescription,
          price: editedPrice,
          primary_image: selectedFile
            ? {
                ...(ad.primary_image || {}),
                file: filePreviewUrl,
                mime_type: selectedFile.type,
              }
            : ad.primary_image,
        };
        onAdUpdated?.(updatedAd);
        toast.success(
          t?.myAds?.editSuccessMessage || "Ad updated successfully!",
        );
      }
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating ad:", error?.response || error);
      toast.error(error.message || "Failed to update ad. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/70" aria-hidden="true"></div>
      <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 pb-[140px] align-middle shadow-xl transition-all sm:py-10 md:pb-[50px]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-[700]">
                {t?.myAds?.editAdTitle || "Edit Ad"}
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t?.myAds?.imageLabel || "Ad Image/Video"}
                </label>
                <div className="mt-1 flex flex-col items-center">
                  {filePreviewKind === "video" ? (
                    <video
                      src={filePreviewUrl}
                      className="mb-2 h-32 w-32 rounded-md border border-gray-300 object-cover"
                      preload="metadata"
                      controls
                      playsInline
                      muted
                    />
                  ) : (
                    <img
                      src={filePreviewUrl}
                      alt="Ad Preview"
                      className="mb-2 h-32 w-32 rounded-md border border-gray-300 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/128x128/CCCCCC/000000?text=File+Error";
                      }}
                    />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-blue-600"
                  >
                    {t?.myAds?.changeFileButton || "Change File"}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t?.myAds?.descriptionLabel || "Description"}
                </label>
                <textarea
                  rows="4"
                  className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm sm:text-sm"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t?.myAds?.priceLabel || "Price (KD)"}
                </label>
                <input
                  type="number"
                  className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm sm:text-sm"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="focus:ring-primary-500 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {t?.myAds?.cancel || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  {t?.myAds?.save || "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------- Renew/Delete Modal --------------- */
function renewModal({ ad, handleOpenRenewModal, t, handleDeleteAd }) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/70" aria-hidden="true"></div>
      <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
            <h2 className="mb-2 text-center font-[700]">
              {t.myAds?.deleteconfirmation || "Delete?"}
            </h2>
            <div>
              <p className="text-center text-sm text-gray-600">
                {t.myAds?.deleteasking ||
                  "Do you really want to delete this ad?"}
              </p>
              <div className="h-4"></div>
              <div className="flex flex-row justify-center">
                <button
                  onClick={handleOpenRenewModal}
                  className="text-primary-900 border-primary-200 hover:bg-primary-50/50 mx-6 inline-flex h-auto shrink-0 items-center justify-center rounded-md border px-4 py-1 text-sm whitespace-nowrap underline-offset-4 transition-colors select-none disabled:opacity-50 lg:px-8 lg:py-2"
                >
                  {t.myAds?.deletecencel || "Cancel"}
                </button>
                <button
                  onClick={handleDeleteAd}
                  className="bg-primary active:bg-active-primary bg-primary-500 hover:bg-primary-600 inline-flex h-auto shrink-0 items-center justify-center rounded-md px-4 py-1 text-sm font-[700] whitespace-nowrap text-white transition-colors select-none disabled:opacity-50 lg:px-8 lg:py-2"
                >
                  {t.myAds?.deletebutton || "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --------------- Translate Modal (placeholder) --------------- */
function translateModal({ ad, handleOpenTranslateModal, t, language, isRTL }) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/70" aria-hidden="true"></div>
      <div
        className="fixed inset-0 z-30 w-screen overflow-y-auto"
        onClick={handleOpenTranslateModal}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-center font-[700]">
              {t?.myAds?.translate || "Translate"}
            </h2>

            <p className="text-center text-sm text-gray-600">{ad?.title}</p>

            <div className="mt-4 flex justify-center">
              <button
                onClick={handleOpenTranslateModal}
                className="text-primary-900 border-primary-200 hover:bg-primary-50/50 mx-6 inline-flex h-auto shrink-0 items-center justify-center rounded-md border px-4 py-1 text-sm"
              >
                {t?.myAds?.close || "Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyAdCard;
