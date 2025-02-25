import React from "react";

interface MatchLineProps {
  matches: { jargonId: number; definitionId: number; isCorrect: boolean }[];
  positions: { [key: number]: { x: number; y: number } };
}

const MatchLine: React.FC<MatchLineProps> = ({ matches, positions }) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {matches.map(({ jargonId, definitionId, isCorrect }, index) => {
        const start = positions[jargonId];
        const end = positions[definitionId];

        if (
          !start ||
          !end ||
          isNaN(start.x) ||
          isNaN(start.y) ||
          isNaN(end.x) ||
          isNaN(end.y)
        )
          return null;

        return (
          <line
            key={index}
            x1={start.x - 85}
            y1={start.y - 50}
            x2={end.x + 65}
            y2={end.y - 40}
            stroke={isCorrect ? "green" : "red"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default MatchLine;
