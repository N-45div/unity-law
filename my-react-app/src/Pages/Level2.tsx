import { useState } from "react";
import MatchItem from "../components/MatchItem";
import MatchLine from "../components/MatchLine";

const jargons = [
  { id: 1, text: "Placeholders" },
  { id: 2, text: "Negotiation" },
  { id: 3, text: "Document Automation" },
  { id: 4, text: "Conditions" },
];

const definitions = [
  {
    id: 1,
    text: "Designated spaces in a document template where specific data can be automatically inserted by a CLM system.",
  },
  {
    id: 2,
    text: "The process within CLM tools that facilitates back-and-forth communication and revisions to reach a mutual agreement on contract terms.",
  },
  {
    id: 3,
    text: "Predefined rules or criteria that trigger specific actions or changes in a contract document within a CLM system.",
  },
  {
    id: 4,
    text: "The use of software to create legal documents by automatically filling in details specific to each case.",
  },
];

const correctMatches = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

const Level2 = () => {
  const [selectedJargon, setSelectedJargon] = useState<number | null>(null);
  const [matches, setMatches] = useState<
    { jargonId: number; definitionId: number; isCorrect: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [positions, setPositions] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  const handleSelection = (jargonId: number, definitionId?: number) => {
    if (!selectedJargon && definitionId === undefined) {
      setSelectedJargon(jargonId);
    } else if (selectedJargon !== null && definitionId !== undefined) {
      const alreadyMatched = matches.some(
        (match) =>
          match.jargonId === selectedJargon ||
          match.definitionId === definitionId
      );

      if (!alreadyMatched) {
        const isCorrect = correctMatches[selectedJargon] === definitionId;
        setMatches([
          ...matches,
          { jargonId: selectedJargon, definitionId, isCorrect },
        ]);
        if (isCorrect) setScore(score + 1);
      }

      setSelectedJargon(null);
    }
  };

  const updatePosition = (id: number, x: number, y: number) => {
    setPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Match the definitions with the correct jargons
      </h1>

      {/* Game Container */}
      <div className="relative w-full max-w-5xl flex justify-between items-center gap-40">
        {/* Left Side (Jargons) */}
        <div className="flex flex-col gap-6">
          {jargons.map((jargon) => (
            <MatchItem
              key={jargon.id}
              id={jargon.id}
              text={jargon.text}
              onSelect={() => handleSelection(jargon.id)}
              isSelected={selectedJargon === jargon.id}
              setPosition={updatePosition}
            />
          ))}
        </div>

        {/* Line SVG */}
        <div className="absolute top-10 -left-80 w-full h-full pointer-events-none">
          <MatchLine matches={matches} positions={positions} />
        </div>

        {/* Right Side (Definitions) */}
        <div className="flex flex-col gap-6">
          {definitions.map((definition) => (
            <MatchItem
              key={definition.id}
              id={definition.id}
              text={definition.text}
              onSelect={() => handleSelection(selectedJargon!, definition.id)}
              isDefinition
              setPosition={updatePosition}
            />
          ))}
        </div>
      </div>

      {/* Score Display */}
      <div className="mt-6 text-lg font-semibold flex items-center gap-2">
  {/* Conditional flag: Red if score < 3, Green if score >= 3 */}
  <div className="w-8 h-8">
    {score < 3 ? (
      // Red Flag 🚩
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4V44" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8H30L24 16L30 24H8V8Z" fill="red" stroke="black" strokeWidth="4" strokeLinejoin="round"/>
      </svg>
    ) : (
      // Green Flag 🚩
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4V44" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8H30L24 16L30 24H8V8Z" fill="green" stroke="black" strokeWidth="4" strokeLinejoin="round"/>
      </svg>
    )}
  </div>

  Score: {score} / {jargons.length}
</div>

    </div>
  );
};

export default Level2;
