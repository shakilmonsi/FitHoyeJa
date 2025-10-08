import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaWhatsapp,
  FaInstagram,
  FaPhoneAlt,
  FaWhatsappSquare,
} from "react-icons/fa"; // Added FaPhoneAlt for the phone icon
// fasdfasdfadsf
export default function AgentsDetails() {
  const { id } = useParams();
  const agentId = id.split("-")[0]; // Extract the numeric ID part (e.g., "123")
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await fetch("/agent.json");
        const data = await response.json();
        // Find the specific agent by ID
        const found = data.find((item) => item.id.toString() === agentId);
        setAgent(found);
      } catch (error) {
        console.error("Error loading agent:", error);
      }
    };
    if (agentId) {
      // Only fetch if agentId is available
      fetchAgent();
    }
  }, [agentId]); // Use agentId as dependency

  if (!agent) return <p>Loading agent details...</p>;

  return (
    <>
      <section className="bg-bgcolor-900 flex h-fit w-full items-center justify-center py-16">
        <div className="flex flex-col items-center p-4 text-center">
          {/* Company Logo / Agent Image - styled to mimic the image's logo block */}
          <div className="">
            <div className="mx-auto mb-2 flex h-45 w-45 items-center justify-center">
              <img
                alt={agent.name}
                src={agent.image}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full rounded-md object-contain"
              />
            </div>
          </div>

          <div>
            {/* Agent Name - Main Heading */}
            <h2 className="mb-2 text-lg font-semibold text-[#fff]">
              {agent.name}
            </h2>

            {/* Agent Description / Slogan */}
            <p className="mb-6 max-w-lg text-sm font-normal text-[#fff]">
              {agent.description}
            </p>

            {/* Contact Buttons */}
            {/* Adjusted space-x-2 to reduce gap between buttons */}
          </div>
          <div className="mb-6 flex items-center space-x-2">
            <button className="ease-in-ou has-only: flex items-center gap-1 rounded-full border-2 border-white bg-green-500 px-6 py-3 text-lg font-bold text-white transition duration-300">
              <FaPhoneAlt> </FaPhoneAlt> 99777396
            </button>

            <button className="rounded-xl bg-white p-1">
              <FaWhatsappSquare className="text-4xl text-green-500" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
