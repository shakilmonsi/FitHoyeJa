import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import MyCredits from "../../components/MyCredits";
import { useLanguage } from "../../context/LanguageContext";
import MyAdCard from "../../components/shared/MyAdCard";
import FabController from "../fab/FabController";
import DetailsModal from "../adDetails/Modal";
import axiosInstance from "../../utils/axiosInstance";

const MyAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  const { isRTL, t, FloatingActionButton } = useLanguage();

  // Resize event to adjust for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch ads from the API
  const fetchAds = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/properties/myAds");
      const adsData = response?.data?.data;

      if (Array.isArray(adsData)) {
        setAds(adsData.map((a) => ({ ...a, views: a?.views ?? 0 })));
      } else {
        setAds([]);
        setError("Unexpected data format from the server.");
      }
    } catch (err) {
      console.error("Error fetching ads:", err);
      setError(
        "Failed to fetch ads. Please check your network connection and try again.",
      );
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch ads on initial load
  useEffect(() => {
    fetchAds();
  }, []);

  // Handle modal overflow visibility when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Handle ad updates
  const handleAdUpdated = (updatedAd) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)),
    );
    setSelectedAd((prev) => (prev?.id === updatedAd.id ? updatedAd : prev));
  };

  // Handle ad deletion
  const handleAdDeleted = (deletedAdId) => {
    setAds((prev) => prev.filter((ad) => ad.id !== deletedAdId));
    if (selectedAd?.id === deletedAdId) {
      setShowModal(false);
      setSelectedAd(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedAd(null);
  };

  // Handle ad click (update view count and show modal)
  const handleAdClick = async (ad) => {
    try {
      const response = await axiosInstance.post(`/properties/view/${ad.id}`);
      const updatedAdFromServer = response?.data?.data;

      if (updatedAdFromServer) {
        // Update the local state with the updated ad from the server
        setAds((prev) =>
          prev.map((currentAd) =>
            currentAd.id === updatedAdFromServer.id
              ? updatedAdFromServer
              : currentAd,
          ),
        );

        setSelectedAd(updatedAdFromServer);
        setShowModal(true);
      } else {
        // If no updated data from the server, just show the ad
        setSelectedAd(ad);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Failed to update view count:", error);

      // Even if the update fails, show the selected ad in the modal
      setSelectedAd(ad);
      setShowModal(true);
    }
  };

  // Loading and error handling UI
  if (loading)
    return <div className="clear-both p-4 text-center text-white">...</div>;

  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  if (ads.length === 0)
    return <div className="p-4 text-center">You have no ads.</div>;

  // Main rendering of the ads page
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
          {ads.map((ad) => (
            <MyAdCard
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
};

export default MyAdsPage;
