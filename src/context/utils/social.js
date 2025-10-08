// src/utils/social.js
export const digitsOnly = (val) => (val || "").toString().replace(/\D/g, "");

export const parseJSONSafe = (maybeJSON) => {
  if (!maybeJSON) return {};
  if (typeof maybeJSON === "object") return maybeJSON;
  try {
    const obj = JSON.parse(maybeJSON);
    return typeof obj === "object" && obj ? obj : {};
  } catch {
    return {};
  }
};

export const normalizeSocialLinks = (links) => {
  const s = parseJSONSafe(links);
  return {
    whatsapp: s.whatsapp || s.phone || "",
    instagram: s.instagram || s.ig || "",
    twitter: s.twitter || "",
    facebook: s.facebook || "",
    linkedin: s.linkedin || "",
  };
};

export const getDaysAgo = (dateStr) => {
  if (!dateStr) return 0;
  const post = new Date(dateStr);
  const now = new Date();
  const diff = now - post;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days < 0 ? 0 : days;
};

export const plural = (n, one, many) => (n === 1 ? one : many);

export const generateSlug = (title) =>
  (title || "")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
