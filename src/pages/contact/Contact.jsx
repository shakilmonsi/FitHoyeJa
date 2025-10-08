// src/components/Contact.jsx

import React from "react";
import { useLanguage } from "../../context/LanguageContext"; // Adjust path if needed

const Contact = () => {
  const { t } = useLanguage();

  const contactInfo = {
    phone: "90078005",
    email: "kwmraqar@gmail.com",
    instagramUser: "mraqar",
    twitterUser: "mraqar",
    instagramLink: "https://www.instagram.com/mraqar",
    twitterLink: "https://x.com/mr_aqar_",
  };

  return (
    <div className="xl ms- mx-auto max-w-4xl px-4 pt-10 pb-[140px] md:pb-12 lg:pb-64">
      {/* Access translations from the 'contact' object */}
      <h2 className="mb-4 text-xl font-bold">{t.contact.heading}</h2>
      <p className="mb-4 text-gray-700">{t.contact.description}</p>

      <ul className="space-y-2 text-gray-800">
        <li>
          <strong>{t.contact.mobile}:</strong>{" "}
          <a
            href={`tel:+${contactInfo.phone}`}
            className="text-blue-600 hover:underline"
          >
            {contactInfo.phone}
          </a>
        </li>
        <li>
          <strong>{t.contact.whatsapp}:</strong>{" "}
          <a
            href={`https://wa.me/${contactInfo.phone}`}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {contactInfo.phone}
          </a>
        </li>
        <li>
          <strong>{t.contact.email}:</strong>{" "}
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-blue-600 hover:underline"
          >
            {contactInfo.email}
          </a>
        </li>
        <li>
          <strong>{t.contact.instagram}:</strong>{" "}
          <a
            href={contactInfo.instagramLink}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {contactInfo.instagramUser}
          </a>
        </li>
        <li>
          <strong>{t.contact.twitter}:</strong>{" "}
          <a
            href={contactInfo.twitterLink}
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {contactInfo.twitterUser}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
