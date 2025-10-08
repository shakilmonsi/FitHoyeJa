import { useState, useEffect } from "react";
import DetailsModal from "../adDetails/Modal";
import { NavLink, useNavigate } from "react-router-dom";
import FabController from "../fab/FabController";
import axios from "../../utils/axiosInstance";
import { useLanguage } from "../../context/LanguageContext";
import MyCredits from "../../components/MyCredits";
import MyAdCard from "../../components/shared/MyAdCard";
import MyArchiveCart from "./MyArchiveComponent/MyArchiveCart";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
};

export default function Ads({ filters }) {
  const [allAds, setAllAds] = useState([]);
  const [displayedAds, setDisplayedAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // State to track if all ads should be shown
  const navigate = useNavigate();
  const { isRTL, t, language, FloatingActionButton } = useLanguage();
  const isMobile = window.innerWidth <= 768;

  // Fetching ads data from the backend (for archived ads)
  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/properties/myArchivedAds", {
        params: { filter: "archived", sortBy: "date" }, // Assuming filters for archived ads
      });
      const adsData = response?.data?.data || [];
      const processedAds = adsData.map((ad) => ({
        ...ad,
        slug: ad.slug || generateSlug(ad.title),
        views: ad.views || 0, // Ensure views are set, default to 0
      }));
      setAllAds(processedAds); // Store processed ads
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the ads on initial load and when the language changes
  useEffect(() => {
    fetchAds();
  }, [language]);

  // Handling filtering and showing ads
  useEffect(() => {
    let adsToShow = allAds;

    if (filters) {
      adsToShow = allAds.filter((ad) => {
        const transactionMatch = filters.transactionType
          ? ad.category_id == filters.transactionType
          : true;
        const regionMatch =
          filters.regions.length > 0
            ? filters.regions.includes(ad.area_id)
            : true;
        const propertyTypeMatch =
          filters.propertyTypes.length > 0
            ? filters.propertyTypes.includes(ad.property_type_id)
            : true;
        return transactionMatch && regionMatch && propertyTypeMatch;
      });
    }

    // This logic handles the "Load More" functionality
    if (showAll || filters) {
      setDisplayedAds(adsToShow);
    } else {
      setDisplayedAds(adsToShow.slice(0, 10)); // Show only 10 items initially
    }
  }, [filters, allAds, showAll]);

  // Handle "Load More"
  const handleLoadMoreClick = () => {
    setShowAll(true);
  };

  // Handle ad click to show modal
  const handleAdClick = async (ad) => {
    try {
      await axios.post(`/properties/view/${ad.id}`);
      const updateAds = (adsList) =>
        adsList.map((currentAd) =>
          currentAd.id === ad.id
            ? { ...currentAd, views: (currentAd.views || 0) + 1 }
            : currentAd,
        );
      setAllAds((prevAds) => updateAds(prevAds));
    } catch (error) {
      console.error("Failed to update view count:", error);
    } finally {
      const updatedAd = allAds.find((a) => a.id === ad.id) || ad;
      setSelectedAd({ ...updatedAd, views: (updatedAd.views || 0) + 1 });
      setShowModal(true);
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "";
    setTimeout(() => setSelectedAd(null), 300);
  };

  // If loading, show the loading spinner
  if (loading) {
    return (
      <section>
        <div className="container">
          <img src="/loading.png" alt="Loading" />
        </div>
      </section>
    );
  }

  const handleAdUpdated = (updatedAd) => {
    setAllAds((prev) =>
      prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)),
    );

    setSelectedAd((prev) => (prev?.id === updatedAd.id ? updatedAd : prev));
  };

  const handleAdDeleted = (deletedAdId) => {
    setAllAds((prev) => prev.filter((ad) => ad.id !== deletedAdId));

    if (selectedAd?.id === deletedAdId) {
      setShowModal(false);

      setSelectedAd(null);
    }
  };
  return (
    <div className="iems-center container mx-auto flex justify-center px-0 pb-30 sm:px-4 sm:pb-2">
      <div className="my-ads-list p-4 sm:w-[680px]">
        <div className="mx-auto mb-8 max-w-2xl">
          <MyCredits />
        </div>

        <div className="mx-auto max-w-2xl">
          <h1>
            <span>{t.myAds.title}</span>

            <NavLink to="/my-archives">
              <span className="text-xs font-bold">
                {" "}
                ({t.myAds.myArchiveAds})
              </span>
            </NavLink>
          </h1>
        </div>

        <h1 className="mb-4 text-2xl font-bold">{t.myAds.myAdsTitle}</h1>

        <div className="grid grid-cols-1 gap-4">
          {displayedAds.map((ad) => (
            <MyArchiveCart
              key={ad.id}
              ad={ad}
              onClick={() => handleAdClick(ad)}
              showRenew={true}
              onAdUpdated={handleAdUpdated}
              onAdDeleted={handleAdDeleted}
            />
          ))}
        </div>

        {showModal && selectedAd && (
          <DetailsModal
            show={showModal}
            onClose={closeModal}
            ad={selectedAd}
            t={t}
            isRTL={isRTL}
          />
        )}

        {isMobile && !FloatingActionButton && !selectedAd && <FabController />}
      </div>
    </div>
  );
}
