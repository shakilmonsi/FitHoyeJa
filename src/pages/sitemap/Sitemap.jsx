import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const ITEMS_PER_PAGE = 10;

const Sitemap = () => {
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allAds, setAllAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [displayedAds, setDisplayedAds] = useState([]);

  // Fetch all ads on component mount
  const { t, isRTL } = useLanguage();


  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  // Fetch all ads on component mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/ads.json");
        const data = await response.json();
        const processedAds = data.map((ad) => ({
          ...ad,
          slug: ad.slug || generateSlug(ad.title),
          views: ad.views || 0,
        }));
        setAllAds(processedAds);

        // Load first page
        const firstPageAds = processedAds.slice(0, ITEMS_PER_PAGE);
        setDisplayedAds(firstPageAds);
        setHasMore(processedAds.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch("/ads.json");
        const data = await response.json();
        const processedAds = data.map((ad) => ({
          ...ad,
          slug: ad.slug || generateSlug(ad.title),
          views: ad.views || 0,
        }));

        setAllAds(processedAds);

        const firstPageAds = processedAds.slice(0, ITEMS_PER_PAGE);
        setDisplayedAds(firstPageAds);
        setHasMore(processedAds.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const nextAds = allAds.slice(startIndex, endIndex);

    setDisplayedAds((prevAds) => [...prevAds, ...nextAds]);
    setCurrentPage(nextPage);
    setHasMore(endIndex < allAds.length);
  };

  useEffect(() => {
    const fetchPropertyType = async () => {
      try {
        const response = await axios.get("/groupPropertyTypes.json");
        setPropertyTypes(response.data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };
    fetchPropertyType();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/companies.json");
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 h-screen py-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {t.siteMapalldata.sitemap}
      </h2>

      <ul className="space-y-4 text-base text-gray-700">
        <li>
          <Link
            to="/search"
            className="ext-[14px] font-[700] text-[#2e6290] hover:underline"
          >
            {t.siteMapalldata.home}
          </Link>
        </li>

        <li>
          <details className="group">
            <summary className="text-[14px] font-[700] text-[#2e6290] hover:underline">
              {t.siteMapalldata.PropertiesforSale} (
              {propertyTypes.filter((p) => p.transactionType === "sale").length}
              )
            </summary>
            <div className="space-y-4 pt-2 pl-4">
              {propertyTypes.map(
                (item, index) =>
                  Array.isArray(item.properties) &&
                  item.properties.length > 0 && (
                    <div key={index}>
                      <p className="mb-1 text-base font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <div className="space-y-1">
                        {item.properties.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={`/search?transactionType=${item.id}&propertyType=${subItem.id}`}
                            className="text-primary-900 text-14px block text-sm font-[700] hover:underline"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </details>
        </li>

        <li>
          <details className="group open">
            <summary className="ext-[14px] font-[700] text-[#2e6290] hover:underline">
              {t.siteMapalldata.PropertiesforRent} ({allAds.length})
            </summary>
            <div className="space-y-2 pt-2 pl-4">
              {displayedAds.map((ad) => (
                <div key={ad.id}>
                  <Link
                    to={`/${ad.id}/ads`}
                    className="ext-[14px] font-[700] text-[#2e6290] hover:underline"
                  >
                    <span>{ad.social_media?.whatsapp || "No WhatsApp"}</span> |{" "}
                    <span>{ad.name}</span>
                  </Link>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="bg-primary hover:bg-primary-dark mt-4 rounded px-4 py-2 text-sm font-semibold text-white"
                >
                  Load More
                </button>
              )}
            </div>
          </details>
        </li>

        <li>
          <details className="group">
            <summary className="text-[14px] font-[700] text-[#2e6290] hover:underline">
              Properties for Exchange in Kuwait (
              {propertyTypes.filter((p) => p.transactionType === "sale").length}
              )
            </summary>
            <div className="space-y-4 pt-2 pl-4">
              {propertyTypes.map(
                (item, index) =>
                  Array.isArray(item.properties) &&
                  item.properties.length > 0 && (
                    <div key={index}>
                      <p className="mb-1 text-base font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <div className="space-y-1">
                        {item.properties.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={`/search?transactionType=${item.id}&propertyType=${subItem.id}`}
                            className="text-primary-900 text-14px block text-sm font-[700] hover:underline"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </details>
        </li>

        <li>
          <details className="group">
            <summary className="text-[14px] font-[700] text-[#2e6290] hover:underline">
              {t.siteMapalldata.propertiesorExchange} ({companies.length})
            </summary>
            <ul className="mt-2 ml-4 space-y-1">
              {companies.map((company) => (
                <li key={company.id}>
                  <Link
                    to={`/agent/${company.id}/ads`}
                    className="text-[14px] font-[700] text-[#2e6290] hover:underline"
                  >
                    <span>
                      {company.social_media?.whatsapp || "No WhatsApp"}
                    </span>{" "}
                    | <span>{company.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </li>

        <li>
          <Link
            to="/about"
            className="text-[14px] font-[700] text-[#2e6290] hover:underline"
          >
            {t.siteMapalldata.aboutUs}
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className="text-[14px] font-[700] text-[#2e6290] hover:underline"
          >
            {t.siteMapalldata.contactUs}
          </Link>
        </li>
        <li>
          <Link
            to="/terms"
            className="text-[14px] font-[700] text-[#2e6290] hover:underline"
          >
            {t.siteMapalldata.termsandConditions}
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default Sitemap;
