import React, { useEffect, useState } from "react";

interface MatchLineProps {
  matches: { jargonId: number; definitionId: number; isCorrect: boolean }[];
  getPositions?: () => { [key: number]: { x: number; y: number } };
}

const MatchLine: React.FC<MatchLineProps> = ({ matches, getPositions = () => ({}) }) => {
  const [positions, setPositions] = useState<{ [key: number]: { x: number; y: number } }>({});

  useEffect(() => {
    const updatePositions = () => {
      if (typeof getPositions === "function") {
        setPositions(getPositions());
      } else {
        console.error("getPositions is not a function");
      }
    };

    updatePositions(); // Initial calculation
    window.addEventListener("resize", updatePositions);

    return () => window.removeEventListener("resize", updatePositions);
  }, [getPositions]);

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
