//===============================================//8-27-2025
import { useState, useEffect } from "react";
import DetailsModal from "../adDetails/Modal";
import { useLanguage } from "../../context/LanguageContext";
import AdCard from "../../components/shared/AdCard";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import FabController from "../fab/FabController";
import axios from "../../utils/axiosInstance";

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
  const navigate = useNavigate();
  const { isRTL, t, language, FloatingActionButton } = useLanguage();
  const isMobile = window.innerWidth <= 768;

  // The number of items to show on the initial page
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/properties");
        const data = response.data.data || [];
        const processedAds = data.map((ad) => ({
          ...ad,
          slug: ad.slug || generateSlug(ad.title),
          views: ad.views || 0,
        }));
        setAllAds(processedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [language]);

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

    // Sort featured ads to appear at the top
    adsToShow.sort((a, b) => b.is_featured - a.is_featured);

    // This is the main change: We only display the first 10 ads here.
    // The "Load More" button will handle navigation.
    setDisplayedAds(adsToShow.slice(0, ITEMS_PER_PAGE));
  }, [filters, allAds]);

  // Handle load more button click: navigate to the search page
  const handleLoadMoreClick = () => {
    navigate("/search");
  };

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

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "";
    setTimeout(() => setSelectedAd(null), 300);
  };

  if (loading) {
    return (
      <section>
        <div className="container bg-white">
          <h3 className="text-white">---</h3>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[#F5F7F9] py-10 pt-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="mb-6 text-lg">{t.ads.recentAdsTitle}</h2>
            <div className="flex flex-col justify-start gap-4">
              {displayedAds.length > 0 ? (
                displayedAds.map((ad) => (
                  <div key={ad.id}>
                    <AdCard
                      ad={ad}
                      t={t}
                      language={language}
                      isRTL={isRTL}
                      onClick={handleAdClick}
                    />
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <h2 className="text-xl font-semibold text-gray-700">
                    No matching ads found.
                  </h2>
                  <p className="text-gray-500">Try adjusting your filters.</p>
                </div>
              )}

              {/* Show the button only if there are more than 10 ads and no filters are applied */}
              {allAds.length > ITEMS_PER_PAGE && !filters && (
                <ButtonSubmit
                  onClick={handleLoadMoreClick}
                  text={
                    <span className="flex items-center justify-center rounded-2xl">
                      <FaCirclePlus className="mx-2 text-xl" />
                      {t.ads.loadMore}
                    </span>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>
      {showModal && selectedAd && (
        <DetailsModal
          show={showModal}
          onClose={closeModal}
          ad={selectedAd}
          t={t}
          isRTL={isRTL}
          language={language}
        />
      )}
      {isMobile && !FloatingActionButton && !showModal && <FabController />}
    </>
  );
}
