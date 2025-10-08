import React, { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

import defaultLogo from "../assits/login/login.png";

import { useLanguage } from "../context/LanguageContext";
import axiosInstance from "../utils/axiosInstance";
import { normalizeSocialLinks, digitsOnly } from "../context/utils/social";

export default function AgentList() {
  const { isRTL, t } = useLanguage();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeNormalizeSocial = (links) => {
    try {
      const maybeObj = typeof links === "string" ? JSON.parse(links) : links;
      return normalizeSocialLinks(maybeObj);
    } catch {
      return normalizeSocialLinks(links);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get("/agents");
        if (!mounted) return;

        const raw = res?.data?.data ?? [];

        const normalized = raw.map((c) => {
          const props = Array.isArray(c?.properties)
            ? c.properties
            : Array.isArray(c?.user?.properties)
              ? c.user.properties
              : [];

          const social =
            c?.social_links ??
            c?.user?.social_links ??
            c?.user?.profile?.social_links ??
            null;

          return {
            id: c.id,
            company_name: c.company_name || c.name || "—",
            company_description: c.company_description || "",
            image: c.image || "",
            properties: props,
            social_links: safeNormalizeSocial(social),
          };
        });

        setCompanies(normalized);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100 px-0 py-8 text-center sm:px-4 md:px-5 md:py-10">
        <h2 className="text-xl font-semibold text-gray-700">
          {t?.agent?.loadingText || "Loading agents..."}
        </h2>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 py-8 text-center text-red-600 sm:px-4 md:px-5 md:py-10">
        <h2 className="text-xl font-semibold">Error: {error.message}</h2>
        <p>Please check your network connection or API endpoint.</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-8 md:px-5 md:py-10">
      <div className="container mx-auto w-full max-w-7xl">
        <div className="mx-auto mb-4 w-full max-w-xl md:max-w-full">
          <div className="w-full text-center md:w-[770px] lg:ml-12">
            <h3
              className={`mb-6 px-2 text-[15px] font-[700] text-gray-800 ${isRTL ? "mr-2" : "ml-2"}`}
            >
              {t?.agent?.titlefast || "Real Estate Agents List in Kuwait"} (
              <span className="px-2">{companies.length}</span>
              {t?.agent?.titlelast || " Agents"})
            </h3>
          </div>

          <div className="mt-4 flex flex-col items-center justify-start gap-4">
            {companies.map((company) => {
              // ✅ show all ads (Open + Archived + Sold + Deleted)
              const adsCount = company.properties?.length || 0;

              const waDigits = digitsOnly(company.social_links?.whatsapp);
              const hasWhatsApp = Boolean(waDigits);
              const hasInstagram = Boolean(company.social_links?.instagram);

              return (
                <div
                  key={company.id}
                  className="w-full rounded-xl border border-gray-200 bg-white shadow-sm md:w-[770px]"
                >
                  <Link
                    to={`/agent/${company.id}/ads`}
                    aria-label={`${company.company_name} details`}
                    className="block p-3 xl:p-4"
                  >
                    <div className="flex gap-3">
                      <div className="relative my-auto">
                        <div className="relative flex-shrink-0">
                          <div className="aspect-square h-28 w-28 overflow-hidden rounded-md md:h-14 md:w-14 xl:h-28 xl:w-28">
                            <img
                              alt={company.company_name}
                              src={company.image || defaultLogo}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = defaultLogo)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-dark font-primary line-clamp-2 text-[15px] font-[700] break-words">
                          {company.company_name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-2 py-1">
                          <p className="text-primary-900 text-sm font-[700]">
                            <span>{adsCount} Ads</span>
                          </p>

                          <span className="text-gray-300">|</span>

                          {hasWhatsApp ? (
                            <span
                              className="inline-flex items-center gap-1"
                              title={`WhatsApp: ${waDigits}`}
                            >
                              <FaWhatsapp className="text-xl" />
                            </span>
                          ) : (
                            <span className="opacity-40">
                              <FaWhatsapp
                                className="text-xl"
                                title="No WhatsApp"
                              />
                            </span>
                          )}

                          {hasInstagram ? (
                            <span
                              className="inline-flex items-center gap-1"
                              title="Instagram"
                            >
                              <FaInstagram className="text-xl" />
                            </span>
                          ) : (
                            <span className="opacity-40">
                              <FaInstagram
                                className="text-xl"
                                title="No Instagram"
                              />
                            </span>
                          )}
                        </div>

                        <p className="line-clamp-2 text-[14px] font-normal text-[#556885] md:text-sm">
                          {company.company_description ||
                            t?.agent?.noDesc ||
                            ""}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
