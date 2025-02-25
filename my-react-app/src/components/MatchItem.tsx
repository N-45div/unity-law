import React, { useEffect, useRef } from "react";

interface MatchItemProps {
  id: number;
  text: string;
  onSelect: () => void;
  isSelected?: boolean;
  isDefinition?: boolean;
  setPosition: (id: number, x: number, y: number) => void;
}

const MatchItem: React.FC<MatchItemProps> = ({ id, text, onSelect, isSelected, isDefinition, setPosition }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const parentRect = ref.current.offsetParent?.getBoundingClientRect();
        if (parentRect) {
          const x = rect.left - parentRect.left + rect.width / 2 - 50; // Shift left
          const y = rect.top - parentRect.top + rect.height / 2;
          setPosition(id, x, y);
        }
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`cursor-pointer px-6 py-3 rounded-lg shadow-md transition-all 
        ${isDefinition ? "bg-white border border-gray-300" : "bg-gradient-to-r from-green-400 to-blue-400 text-white"}
        ${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      {text}
    </div>
  );
};

export default MatchItem;
