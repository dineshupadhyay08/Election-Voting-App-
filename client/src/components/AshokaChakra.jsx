import React from "react";

// Ashoka Chakra SVG Component
// A clean, neutral representation of the Ashoka Chakra wheel
// Suitable for election/voting context, not government branding
const AshokaChakra = ({ size = 20, strokeWidth = 1.5, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block" }}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="10" />

      {/* Inner circle */}
      <circle cx="12" cy="12" r="6" />

      {/* 24 spokes (Ashoka Chakra has 24 spokes) */}
      {/* Drawing 24 spokes radiating from center */}
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map(
        (angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 12 + 6 * Math.cos(rad);
          const y1 = 12 + 6 * Math.sin(rad);
          const x2 = 12 + 10 * Math.cos(rad);
          const y2 = 12 + 10 * Math.sin(rad);
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />
          );
        }
      )}

      {/* Center dot */}
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
};

export default AshokaChakra;
