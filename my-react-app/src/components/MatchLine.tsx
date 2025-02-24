import React, { useEffect, useState } from "react";

interface MatchLineProps {
  matches: { jargonId: number; definitionId: number; isCorrect: boolean }[];
  getPositions: () => { [key: number]: { x: number; y: number } };
}

const MatchLine: React.FC<MatchLineProps> = ({ matches, getPositions }) => {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});

  useEffect(() => {
    const updatePositions = () => {
      setPositions(getPositions());
    };

    updatePositions(); // Initial calculation
    window.addEventListener("resize", updatePositions);

    return () => window.removeEventListener("resize", updatePositions);
  }, [getPositions]);

  return (
    <svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
      {matches.map((match, index) => {
        const start = positions[match.jargonId];
        const end = positions[match.definitionId];

        if (!start || !end) return null;

        return (
          <line
            key={index}
            x1={start.x + 5} // Added slight variation
            y1={start.y}
            x2={end.x - 5} // Added slight variation
            y2={end.y}
            stroke={match.isCorrect ? "green" : "red"}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default MatchLine;
