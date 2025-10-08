import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import AdCard from "../../components/shared/AdCard";
import DetailsModal from "../adDetails/Modal";
import axios from "../../utils/axiosInstance";

const SearchResults = () => {
  const { t, isRTL, language } = useLanguage();
  const location = useLocation();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedAd(null), 300);
  };

  // This useEffect listens for changes to the URL's search string.
  // When the filter bar changes the URL, this code will run again.
  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        // The API call now includes the filter parameters from the URL.
        const response = await axios.get(`/properties${location.search}`);
        setAds(response.data.data || []);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setAds([]); // Clear results on error
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredData();
  }, [location.search]); // The dependency on `location.search` makes it reactive.

  // --- THIS IS THE FIX FOR TEXT SEARCH ---

  // 1. Get the current `searchText` from the URL query parameters.
  const searchText = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("searchText")?.toLowerCase() || "";
  }, [location.search]);

  const { minPrice, maxPrice } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
    };
  }, [location.search]);

  const filteredAds = useMemo(() => {
    // First filter by text if searchText exists (keep your existing logic)
    let results = ads;
    if (searchText) {
      results = results.filter(
        (ad) =>
          (ad.title && ad.title.toLowerCase().includes(searchText)) ||
          (ad.description && ad.description.toLowerCase().includes(searchText)),
      );
    }

    // Then add price filtering (new part)
    if (minPrice) {
      results = results.filter((ad) => ad.price >= parseInt(minPrice, 10));
    }
    if (maxPrice) {
      results = results.filter((ad) => ad.price <= parseInt(maxPrice, 10));
    }

    return results;
  }, [ads, searchText, minPrice, maxPrice]); // Add minPrice/maxPrice to dependencies

  return (
    <div
      className="min-h-[60vh] pb-[100px] sm:py-10 md:pb-[50px]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="px-4 py-6">
        <div className="container mx-auto max-w-xl">
          {/* We now use `filteredAds.length` to show the correct count */}
          <h1 className="mt-4 mb-6 text-[20px] font-bold">
            {t.search.searchResults} ({loading ? "..." : filteredAds.length}{" "}
            {t.search.ads})
          </h1>
          {loading ? (
            <div className="p-10 text-center">{t.search.loading}</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {/* And we map over `filteredAds` to display the results */}
              {filteredAds.length > 0 ? (
                filteredAds.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    t={t}
                    language={language}
                    isRTL={isRTL}
                    variant="default"
                    onClick={handleAdClick}
                  />
                ))
              ) : (
                <div className="text-primary-900 shadow-card-shadow col-span-full rounded-lg bg-white p-10 text-center font-[700]">
                  {t.search.noResultsFound}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <DetailsModal
        show={showModal}
        onClose={closeModal}
        ad={selectedAd}
        t={t}
        isRTL={isRTL}
        language={language}
      />
    </div>
  );
};

export default SearchResults;
