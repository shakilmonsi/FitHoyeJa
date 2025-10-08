import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { NavLink } from "react-router-dom";
import MyAdCard from "./shared/MyAdCard";

export default function MyCredits() {
  const { isRTL, t } = useLanguage();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/packages.json");
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex flex-wrap justify-center gap-4 md:flex-nowrap">
          <div className="shadow-card-shadow relative w-full max-w-md grow-1 rounded-lg bg-white px-4">
            <div className="flex h-full flex-col">
              <h2 className="mt-5 text-center">{t.creditComponent.title}</h2>
              <div className="my-4 flex items-center justify-center gap-3">
                {packages.map((tem, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3"
                  >
                    <div className="text-primary-900 text-lg leading-none font-bold">
                      {tem.credits}
                    </div>
                    <div className="text-sm leading-none">{tem.name}</div>
                  </div>
                ))}
              </div>
              <NavLink
                to="/buy-credits"
                className="bg-success text-on-success active:bg-active-success bg-primary-500 hover:bg-primary-600 inline-flex h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-6 text-sm font-[700] whitespace-nowrap text-white transition-colors select-none sm:w-auto"
              >
                {t.creditComponent.buyCredit}
              </NavLink>
              <div className="h-4" />
            </div>
          </div>
        </div>
        <p className={`mt-5 text-center text-xs`}>
          {t.site.contactUs} {t.site.via}{" "}
          <a href="tel:+96590078005" className="text-primary-900 !font-[700]">
            {t.site.call}
          </a>{" "}
          {t.site.or}{" "}
          <a
            href="https://wa.me/96590078005"
            className="text-primary-900 !font-[700]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.site.whatsapp}
          </a>
        </p>
      </div>
    </>
  );
}
