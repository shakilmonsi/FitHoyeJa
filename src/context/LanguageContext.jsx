import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";
import axios from "../utils/axiosInstance";

const LanguageContext = createContext();
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ar");
  const [isRTL, setIsRTL] = useState(true);
  const [FloatingActionButton, setFloatingActionButton] = useState(false);

  const [currentRegionData, setCurrentRegionData] = useState([]);
  const [currentPropertyTypesData, setCurrentPropertyTypesData] = useState([]);
  const [currentTransactionTypesData, setCurrentTransactionTypesData] =
    useState([]);
  const [currentGroupPropertyTypesData, setCurrentGroupPropertyTypesData] =
    useState([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "ar";
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const isArabic = language === "ar";
    setIsRTL(isArabic);
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = language;
    localStorage.setItem("language", language);

    const fetchAllData = async () => {
      try {
        const [
          regionsResponse,
          propertyTypesResponse,
          currentTransactionTypesData,
        ] = await Promise.all([
          axios.get("/areas"),
          axios.get("/property-types"),
          axios.get("/categories"),
        ]);

        setCurrentRegionData(regionsResponse.data.data || []);
        setCurrentPropertyTypesData(propertyTypesResponse.data.data || []);
        setCurrentTransactionTypesData(
          currentTransactionTypesData.data.data || [],
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setCurrentRegionData([]);
        setCurrentPropertyTypesData([]);
      }
    };

    fetchAllData();
  }, [language]);

  const toggleLanguage = (newLang) => {
    const finalLang =
      typeof newLang === "string" ? newLang : language === "en" ? "ar" : "en";
    setLanguage(finalLang);
  };

  const t = translations[language];

  const value = {
    language,
    isRTL,
    toggleLanguage,
    t,
    currentRegionData,
    currentPropertyTypesData,
    currentTransactionTypesData,
    currentGroupPropertyTypesData,
    FloatingActionButton,
    setFloatingActionButton,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
