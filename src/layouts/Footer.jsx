import { FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

// Link with bilingual support
const FooterLink = ({ to, label, isRTL }) => {
  const text = typeof label === "string" ? label : isRTL ? label.ar : label.en;
  return (
    <li>
      <Link to={to} className="transition-colors hover:text-white">
        {text}
      </Link>
    </li>
  );
};

// Social icon button
const FooterIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded bg-white/20 p-2 hover:bg-white/30"
  >
    {icon}
  </a>
);

// App store badge
const StoreBadge = ({ src, alt, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    <img src={src} alt={alt} className="h-10" />
  </a>
);

const pagesLinks = [
  { to: "/agents", label: { en: "Agents", ar: "المكاتب" } },
  { to: "/about", label: { en: "About Us", ar: "نبذة عنا" } },
  { to: "/contact", label: { en: "Contact Us", ar: "إتصل بنا" } },
  {
    to: "/terms",
    label: { en: "Terms and Conditions", ar: "الشروط والأحكام" },
  },
  { to: "/sitemap", label: { en: "Sitemap", ar: "خريطة الموقع" } },
];

// Footer Component
const Footer = () => {
  // Move all hooks to the top level
  const location = useLocation();
  const [width, setWidth] = useState(window.innerWidth);
  const { t, isRTL } = useLanguage();
  const [properties, setProperties] = useState([]);
  const { language } = useLanguage();
  const [groupPropertyTypesArbicData, setgroupPropertyTypesArbicData] =
    useState([]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // propertyTypeData লোড করার জন্য useEffect
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        // ভাষার উপর ভিত্তি করে সঠিক JSON ফাইলটি লোড করা হচ্ছে
        const url =
          language === "ar"
            ? "/groupPropertyTypesArbic.json"
            : "/groupPropertyTypes.json";
        const response = await fetch(url);
        const data = await response.json();
        setgroupPropertyTypesArbicData(data);
      } catch (error) {
        console.error("Error fetching property types data:", error);
      }
    };

    fetchPropertyTypes();
  }, [language]); // language স্টেট পরিবর্তন হলে এটি আবার রান করবে

  useEffect(() => {
    const fetchPropertyType = async () => {
      try {
        const response = await axios.get("/groupPropertyTypes.json");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };
    fetchPropertyType();
  }, []);

  const isMobile = width <= 768; // Mobile breakpoint
  const isHomePage = location.pathname === "/";

  // This is the condition to HIDE the footer
  if (isMobile && !isHomePage) {
    return null; // Render nothing if it's mobile and not the home page
  }

  return (
    <footer className="bg-primary-600 mt-4 px-6 py-10 pb-30 text-sm text-white lg:pb-8">
      <div
        className={`mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-4 ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        {groupPropertyTypesArbicData.length > 0 &&
          groupPropertyTypesArbicData.map((property) => (
            <div key={property.id}>
              <h2 className="mb-2 text-base">{property.title}</h2>
              <ul className="space-y-1">
                {property.properties.length > 0 &&
                  property.properties.map((link) => (
                    <NavLink
                      key={link.id}
                      to={`/search?transactionType=${property.id}&propertyType=${link.id}`}
                      className="block transition-colors hover:text-white/80"
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </ul>
            </div>
          ))}
        <div>
          <h2 className="mb-2 text-base">{isRTL ? "صفحات " : "Pages"}</h2>
          <ul className="space-y-1">
            {pagesLinks.map(({ to, label }) => (
              <FooterLink key={to} to={to} label={label} isRTL={isRTL} />
            ))}
          </ul>

          <div className="mt-4 flex space-x-3">
            <FooterIcon
              href="https://www.youtube.com/@mr_aqar"
              icon={<FaYoutube />}
            />
            <FooterIcon
              href="https://www.instagram.com/mraqar"
              icon={<FaInstagram />}
            />
            <FooterIcon href="https://x.com/mr_aqar_" icon={<FaTwitter />} />
          </div>

          <div className="mt-4 flex space-x-2">
            <StoreBadge
              src="/GooglePlay.png"
              alt="Google Play"
              href="https://play.google.com/"
            />
            <StoreBadge
              src="/AppleStore.png"
              alt="App Store"
              href="https://www.apple.com/app-store/"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
