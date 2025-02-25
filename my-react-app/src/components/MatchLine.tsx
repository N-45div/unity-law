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

        console.log("Start Position:", start);
        console.log("End Position:", end);
        console.log("Matches:", matches);
        console.log("Positions:", positions);
        // console.log("Jargon Position:", positions[match.jargonId]);
        // console.log("Definition Position:", positions[match.definitionId]);

        if (!start || !end) return null;

        return (
          <line
            key={index}
            x1={start.x-50}
            y1={start.y}
            x2={end.x-5}
            y2={end.y}
            stroke={isCorrect ? "green" : "red"}
            strokeWidth="5" // Increased stroke width
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default MatchLine;
