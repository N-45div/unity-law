import React, { useEffect, useState } from "react";

interface MatchItemProps {
  id: number;
  text: string;
  onSelect: () => void;
  isSelected?: boolean;
  isDefinition?: boolean;
  matchedJargon?: number;
  isCorrect?: boolean;
}

const MatchItem: React.FC<MatchItemProps> = ({
  id,
  text,
  onSelect,
  isSelected,
  isDefinition,
  matchedJargon,
  isCorrect,
}) => {
  const [bgColor, setBgColor] = useState("bg-white");

  useEffect(() => {
    if (isCorrect === true) {
      setBgColor("bg-[#99FF99]"); // Correct match - Green
    } else if (isCorrect === false) {
      setBgColor("bg-[#FF9999]"); // Incorrect match - Red
    } else {
      setBgColor("bg-white"); // Default color
    }
  }, [isCorrect]);

  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform relative
        ${
          isDefinition
            ? "border border-gray-300 hover:shadow-xl"
            : "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:brightness-110"
        }
        ${isSelected ? "ring-4 ring-blue-500 scale-105" : ""}
        ${bgColor}`}
    >
      <span className="text-sm font-medium">{text}</span>

      {/* Improved Number Circle (Top-right) */}
      {matchedJargon !== undefined && (
        <span
          className="absolute top-1.5 right-1.5 bg-blue-600 text-white w-6 h-6 flex items-center justify-center 
          text-xs font-bold rounded-full border-2 border-white shadow-md transition-all duration-300 ease-in-out"
        >
          {matchedJargon}
        </span>
      )}
    </div>
  );
};

export default MatchItem;
