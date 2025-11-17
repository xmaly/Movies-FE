"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  maxStars?: number;
};

export function StarRating({ value, onChange, maxStars = 10 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(star)}
            className="p-0 transition"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={star <= displayValue ? "#8fcf3c" : "none"}
              stroke={star <= displayValue ? "#8fcf3c" : "#4b5563"}
              strokeWidth="2"
              className="w-6 h-6 cursor-pointer"
            >
              <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 20.16 24.02 12 18.35 3.84 24.02 6.23 16.01 0 10.35 8.91 10.26" />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-lg font-semibold text-[#8fcf3c] min-w-[2rem]">
        {displayValue > 0 ? displayValue : "—"}
      </span>
    </div>
  );
}
