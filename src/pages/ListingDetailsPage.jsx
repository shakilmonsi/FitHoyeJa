// src/pages/ListingDetailsPage.jsx (উদাহরণস্বরূপ)
import React from "react";
import { useParams, Link } from "react-router-dom";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { HiPhone } from "react-icons/hi";

// ডামি ডেটা (আপনার আসল ডেটা দ্বারা প্রতিস্থাপন করুন)
const dummyListingDetails = {
  listingId: "listing123",
  title: "Luxury Apartment in Bashundhara",
  sellerId: "user123_seller", // এই আইডি দিয়েই চ্যাট শুরু হবে
  sellerPhone: "01712345678",
  // ... অন্যান্য বিবরণ ...
};

const ListingDetailsPage = () => {
  const { listingId } = useParams();
  const listing = dummyListingDetails; // এখানে আপনার API থেকে ডেটা আসবে

  return (
    <div className="p-4">
      {/* ... বিজ্ঞাপনের অন্যান্য বিবরণ ... */}
      <div className="flex items-center justify-around border-t pt-4">
        <Link
          to={`/chats/${listing.sellerId}`} // বিক্রেতার আইডি দিয়ে চ্যাট পেজে নেভিগেট করুন
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <BsChatLeftDotsFill className="mr-1 h-5 w-5" />
          Chat with Seller
        </Link>
        <a
          href={`tel:${listing.sellerPhone}`}
          className="ml-4 flex items-center text-green-600 hover:text-green-800"
        >
          <HiPhone className="mr-1 h-5 w-5" />
          Call Seller
        </a>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
