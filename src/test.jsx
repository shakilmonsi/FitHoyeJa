import React from "react";

export default function PricingCards() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-sm">
        <div className="space-y-8">
          {/* Premium Subscription Card */}
          <div className="flex items-start gap-6">
            {/* Price Box */}
            <div className="flex h-20 w-24 flex-col items-center justify-center rounded-lg bg-sky-400 text-white">
              <div className="text-2xl font-bold">150</div>
              <div className="text-sm font-bold">KWD</div>
            </div>

            {/* Banner and Description */}
            <div className="flex flex-col pt-1">
              {/* Dark Blue Banner */}
              <div
                className="relative mb-2 bg-slate-800 px-4 py-2 text-sm font-bold text-white"
                style={{
                  clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)",
                  width: "140px",
                }}
              >
                Agents Subscr
              </div>

              {/* Description */}
              <div className="text-lg font-bold text-gray-800 italic">
                30 ADS PREM
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
