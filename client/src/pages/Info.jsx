import React from "react";
import { toast } from "react-toastify";

const dataSections = {};

const InfoCards = () => {
  const handleRestrictedClick = () => {
    toast.info("कृपया लॉगिन करें। Redirecting...");
    setTimeout(() => (window.location.href = "/login"), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {Object.entries(dataSections).map(([section, items]) => (
        <div key={section}>
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            {section === "pressReleases"
              ? "Press Releases"
              : section === "governmentDocs"
                ? "Government Documents"
                : section === "tenders"
                  ? "Tenders"
                  : "Latest Updates"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={handleRestrictedClick}
                className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
              >
                <p className="text-gray-500 text-sm mb-2">{item.date}</p>
                <h3 className="font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
