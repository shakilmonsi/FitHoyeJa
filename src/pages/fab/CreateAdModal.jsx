import React from "react";
import { FiX } from "react-icons/fi";
import AdUploadForm from "../adUpload/AdUpload";

const CreateAdModal = ({ isOpen, onClose }) => {
  // If not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* The dark overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-10 bg-black transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} `}
      />

      {/* The main content that slides down */}
      <div
        className={`fixed inset-0 z-[2000] overflow-y-auto bg-white transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"} `}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full"
        >
          <FiX />
        </button>

        <AdUploadForm />
      </div>
    </>
  );
};

export default CreateAdModal;
