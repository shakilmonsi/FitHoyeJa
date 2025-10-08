import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { MdFileUpload } from "react-icons/md";
import { FiSearch, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ButtonSubmit from "../../common/button/ButtonSubmit";
import { useLanguage } from "../../context/LanguageContext";
import axiosInstance from "../../utils/axiosInstance";

/* ---------------- SingleSelectDropdown (unchanged) ---------------- */
const SingleSelectDropdown = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder,
  noResultsText,
  isRTL,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange(null);
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedOption = options.find((o) => o.id === selectedValue);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <div
        className="flex h-[42px] cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white p-2 rtl:flex-row-reverse"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiSearch className="flex-shrink-0 text-[var(--color-primary-500)]" />
        <div className="flex-grow rtl:text-right">
          {!selectedOption ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            <span className="text-sm font-medium text-gray-800">
              {selectedOption.name}
            </span>
          )}
        </div>
        <div className="flex-shrink-0">
          {selectedOption && (
            <FiX
              className="cursor-pointer text-gray-500 hover:text-gray-800"
              onClick={clearSelection}
            />
          )}
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <FiChevronUp className="text-primary-500" />
          ) : (
            <FiChevronDown className="text-primary-500" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-gray-300 p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className={`flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-cyan-50 ${selectedValue === option.id ? "bg-cyan-100" : ""}`}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <span className="text-gray-700 ltr:ml-3 rtl:mr-3">
                    {option.name}
                  </span>
                  {option.count !== undefined && option.count !== null && (
                    <span className="px-4 text-sm text-gray-700">
                      ({option.count})
                    </span>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">{noResultsText}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/* ---------------- AdUploadForm ---------------- */
const AdUploadForm = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [options, setOptions] = useState({
    purposes: [],
    propertyTypes: [],
    areas: [],
  });

  const initialFormData = {
    title: "",
    purposes: null,
    propertyTypes: null,
    description: "",
    regions: null,
    price: "",
    images: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  // Allowed file extensions
  const ALLOWED_EXT = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "tiff",
    "ico",
    "mp4",
    "mov",
    "avi",
    "wmv",
    "flv",
    "webm",
    "mkv",
    "3gp",
    "ogv",
    "ts",
    "mpg",
    "mpeg",
    "vob",
  ];

  const isAllowed = (file) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return ALLOWED_EXT.includes(ext);
  };

  // Util: log FormData contents
  const logFormData = (fd) => {
    console.groupCollapsed("%c[DEBUG] FormData entries", "color:#0a7");
    for (const [key, val] of fd.entries()) {
      if (val instanceof File) {
        console.log(
          key,
          `→ File(name="${val.name}", size=${val.size} bytes, type="${val.type}")`,
        );
      } else {
        console.log(key, "→", val);
      }
    }
    console.groupEnd();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, propTypesRes, areasRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/property-types"),
          axiosInstance.get("/areas"),
        ]);
        setOptions({
          purposes: categoriesRes.data.data || [],
          propertyTypes: propTypesRes.data.data || [],
          areas: areasRes.data.data || [],
        });
      } catch (error) {
        console.error("[FETCH ERROR] Failed to load dropdown data:", error);
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSingleSelectChange = (fieldName, selectedId) => {
    setFormData((prev) => ({ ...prev, [fieldName]: selectedId }));
  };

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    console.groupCollapsed("%c[DEBUG] Files picked", "color:#07a");
    picked.forEach((f, i) =>
      console.log(`#${i + 1}:`, f.name, "|", f.type, "|", f.size, "bytes"),
    );
    console.groupEnd();

    const bad = picked.filter((f) => !isAllowed(f));
    if (bad.length) {
      toast.error(
        `These files are not allowed: ${bad.map((b) => b.name).join(", ")}`,
      );
      e.target.value = "";
      return;
    }

    if (picked.length + formData.images.length > 12) {
      toast.error(t.adUploadForm.fileLimitError);
      return;
    }

    // Create an array of objects with the file and a preview URL
    const newImagesWithPreviews = picked.map((file) => {
      // Create a temporary URL for the image preview
      const previewUrl = URL.createObjectURL(file);
      return { file, previewUrl };
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImagesWithPreviews],
    }));

    // Close file picker after selecting
    try {
      e.target.value = ""; // Reset file input field
    } catch (err) {
      console.warn("Could not clear file input.", err);
    }
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      // Revoke the object URL to free up memory
      URL.revokeObjectURL(newImages[index].previewUrl);
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const postData = new FormData();
    postData.append("category_id", formData.purposes);
    postData.append("property_type_id", formData.propertyTypes);
    postData.append("area_id", formData.regions);
    postData.append("title", formData.title);

    const slug = (formData.title || "")
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    postData.append("slug", slug);

    postData.append("description", formData.description);
    postData.append("price", formData.price);
    postData.append("status", "1");

    if (formData.images.length > 0) {
      // Append the actual File objects, not the preview objects
      postData.append("primary_file", formData.images[0].file);
      formData.images.slice(1).forEach((item) => {
        postData.append("files[]", item.file);
      });
    }

    // Debug: dump form + fields
    console.groupCollapsed(
      "%c[DEBUG] Submitting /properties/create",
      "color:#b50",
    );
    console.log("Endpoint:", "/properties/create");
    console.log("Meta:", {
      purposes: formData.purposes,
      propertyTypes: formData.propertyTypes,
      regions: formData.regions,
      title: formData.title,
      slug,
      price: formData.price,
      imagesCount: formData.images.length,
    });
    logFormData(postData);
    console.groupEnd();

    try {
      const res = await axiosInstance.post("/properties/create", postData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          console.log(`[UPLOAD] ${pct}% (${evt.loaded}/${evt.total} bytes)`);
        },
      });

      console.groupCollapsed("%c[SUCCESS] Server response", "color:#080");
      console.log("Status:", res.status, res.statusText);
      console.log("Data:", res.data);
      console.groupEnd();

      toast.success("Ad created successfully!");
      setFormData(initialFormData);

      navigate("/my-ads", { replace: true });
    } catch (error) {
      console.groupCollapsed("%c[ERROR] Request failed", "color:#d00");
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("StatusText:", error.response.statusText);
        console.log("Headers:", error.response.headers);
        console.log("Data:", error.response.data);
      } else if (error.request) {
        console.log("No response received. Request object:", error.request);
      } else {
        console.log("Config/Setup error:", error.message);
      }
      console.log("Axios config:", error.config);
      console.groupEnd();

      // UI feedback
      toast.error("Failed to create ad.");
      if (error?.response?.status === 413) {
        toast.error("File too large (413). Try smaller files or compress.");
      }
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        toast.error(
          "Server Error: " +
            Object.values(error.response.data.errors).flat().join(", "),
        );
      }
      if (error?.message?.includes("Network Error")) {
        toast.error("Network/CORS issue. Check server, URL, and CORS.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img
          src="/loading.png"
          alt={t.adUploadForm.loading || "Loading..."}
          className="h-20 w-20"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 mb-15 max-w-4xl p-4 sm:p-6 md:p-8 lg:mb-60">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">
          {t.adUploadForm.formTitle}
        </h1>
        <p className="mb-8 text-gray-600">{t.adUploadForm.formSubtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
      >
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t.adUploadForm.purposeLabel}
          </label>
          <SingleSelectDropdown
            options={options.purposes}
            selectedValue={formData.purposes}
            onChange={(id) => handleSingleSelectChange("purposes", id)}
            placeholder={t.adUploadForm.purposePlaceholder}
            searchPlaceholder={t.adUploadForm.searchPlaceholder}
            noResultsText={t.adUploadForm.noResults}
            isRTL={isRTL}
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t.adUploadForm.propertyTypeLabel}
          </label>
          <SingleSelectDropdown
            options={options.propertyTypes}
            selectedValue={formData.propertyTypes}
            onChange={(id) => handleSingleSelectChange("propertyTypes", id)}
            placeholder={t.adUploadForm.propertyTypePlaceholder}
            searchPlaceholder={t.adUploadForm.searchPlaceholder}
            noResultsText={t.adUploadForm.noResults}
            isRTL={isRTL}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t.adUploadForm.descriptionLabel}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder={t.adUploadForm.descriptionPlaceholder}
            rows={4}
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t.adUploadForm.areaLabel}
          </label>
          <SingleSelectDropdown
            options={options.areas}
            selectedValue={formData.regions}
            onChange={(id) => handleSingleSelectChange("regions", id)}
            placeholder={t.adUploadForm.areaPlaceholder}
            searchPlaceholder={t.adUploadForm.searchPlaceholder}
            noResultsText={t.adUploadForm.noResults}
            isRTL={isRTL}
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {t.adUploadForm.priceLabel}
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
            placeholder={t.adUploadForm.pricePlaceholder}
          />
        </div>

        <div className="mt-4 rounded-lg border-2 border-dashed border-[var(--color-primary-500)] p-6 text-center md:col-span-2">
          <h2 className="text-xl font-bold text-gray-800">
            {t.adUploadForm.filesUploadTitle ?? "Upload Files"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t.adUploadForm.filesUploadSubtitle ?? "You can upload images"}
          </p>

          <label
            htmlFor="file-upload"
            className="mt-4 inline-block cursor-pointer rounded-md bg-[var(--color-primary-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-700)]"
          >
            {t.adUploadForm.filesSelectButton ?? "Choose files"}
          </label>

          <input
            type="file"
            multiple
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Show selected files */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 sm:grid-cols-3 md:grid-cols-4">
              {formData.images.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg shadow-md"
                >
                  {/* Check file type and render accordingly */}
                  {item.file.type.startsWith("video/") ? (
                    <video
                      src={item.previewUrl}
                      className="h-32 w-full object-cover"
                      controls
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-32 w-full object-cover"
                    />
                  )}

                  {/* Remove button always visible at top-right */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="hover:bg-bgcolor-900 absolute top-1 right-1 z-10 rounded-full bg-white p-1.5 text-black transition-colors"
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <FiX size={16} />
                  </button>
                  <span className="bg-opacity-50 absolute bottom-1 left-1 max-w-[calc(100%-8px)] truncate rounded-sm bg-black p-1 text-xs text-white">
                    {item.file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 md:col-span-2">
          <ButtonSubmit
            disabled={submitting}
            text={
              <span className="flex items-center justify-center">
                <MdFileUpload className="mr-2 text-xl" />
                {submitting
                  ? t.adUploadForm.submittingButton
                  : t.adUploadForm.submitButton}
              </span>
            }
            className="!w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default AdUploadForm;
