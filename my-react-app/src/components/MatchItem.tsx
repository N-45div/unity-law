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
        const container = document.getElementById("game-container")?.getBoundingClientRect();

        if (container) {
          const x = rect.left - container.left + rect.width / 2; // Center X
          const y = rect.top - container.top + rect.height / 2; // Center Y
          setPosition(id, x, y);
        }
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [id]);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`cursor-pointer px-6 py-3 rounded-lg shadow-md transition-all ${
        isDefinition ? "bg-white border border-gray-300" : "bg-gradient-to-r from-green-400 to-blue-400 text-white"
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      {text}
    </div>
  );
};

export default MatchItem;
