import React from "react";

interface MatchLineProps {
  matches: { jargonId: number; definitionId: number; isCorrect: boolean }[];
  positions: { [key: number]: { x: number; y: number } };
}

const MatchLine: React.FC<MatchLineProps> = ({ matches, positions }) => {
  return (
    <svg className="absolute w-full h-full top-0 left-0 pointer-events-none">
      {matches.map((match, index) => {
        const start = positions[match.jargonId];
        const end = positions[match.definitionId];

        if (!start || !end) return null;

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
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
