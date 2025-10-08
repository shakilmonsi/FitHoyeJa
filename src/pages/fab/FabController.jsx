import React, { useState } from "react";
import CreateAdModal from "./CreateAdModal";
import FloatingActionButton from "./FloatingActionButton";

const FabController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <FloatingActionButton
        isOpen={isModalOpen}
        onClick={isModalOpen ? closeModal : openModal}
      />

      <CreateAdModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default FabController;
