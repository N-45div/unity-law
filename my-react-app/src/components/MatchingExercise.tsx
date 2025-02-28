import { useState, useRef, useEffect } from 'react';
import { MatchingItem } from '../types';
import MatchLine from './MatchLine';
import '../styles/MatchingExercise.css';

interface MatchingExerciseProps {
  data: MatchingItem[];
}

const MatchingExercise = ({ data }: MatchingExerciseProps) => {
  const [items, setItems] = useState<MatchingItem[]>([...data]);
  const [selectedTerm, setSelectedTerm] = useState<MatchingItem | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [lines, setLines] = useState<
    {
      startId: string;
      endId: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
    }[]
  >([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const termRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const defRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle Term Click
  const handleTermClick = (item: MatchingItem) => {
    if (item.isMatched) return;
    setSelectedTerm((prev) => (prev?.id === item.id ? null : item));
  };

  // Handle Definition Click
  // Handle Definition Click
const handleDefinitionClick = (item: MatchingItem) => {
  if (!selectedTerm || item.isMatched || Object.values(matches).includes(item.id)) return;

  // Check if the selected term is already matched
  if (matches[selectedTerm.id]) return;

  const isCorrectMatch = item.id === selectedTerm.id;
  const lineColor = isCorrectMatch ? '#10B981' : '#EF4444'; // Green for correct, Red for incorrect

  const termElement = termRefs.current[selectedTerm.id];
  const defElement = defRefs.current[item.id];

  if (termElement && defElement) {
    const termRect = termElement.getBoundingClientRect();
    const defRect = defElement.getBoundingClientRect();

    // ❌ Remove existing connections from this term
    setLines((prevLines) => prevLines.filter((line) => line.startId !== selectedTerm.id));

    setLines((prevLines) => [
      ...prevLines,
      {
        startId: selectedTerm.id,
        endId: item.id,
        startX: termRect.right + 5,
        startY: termRect.top + termRect.height / 2,
        endX: defRect.left - 5,
        endY: defRect.top + defRect.height / 2,
        color: lineColor,
      },
    ]);
  }

  if (isCorrectMatch) {
    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, isMatched: true } : i
    );
    setItems(updatedItems);
    setMatches((prev) => ({
      ...prev,
      [selectedTerm.id]: item.id, // ✅ Ensures one match per term
    }));
  } else {
    // If the match is incorrect, still mark the term as matched
    setMatches((prev) => ({
      ...prev,
      [selectedTerm.id]: item.id, // ✅ Ensures one match per term
    }));
  }

  setSelectedTerm(null);
};

  // Reset Exercise
  const resetExercise = () => {
    setItems(data.map((item) => ({ ...item, isMatched: false })));
    setSelectedTerm(null);
    setMatches({});
    setLines([]);
    setShowCompletion(false);
  };

  // Update lines on window resize
  useEffect(() => {
    const updateLines = () => {
      setLines((prevLines) =>
        prevLines.map((line) => {
          const termElement = termRefs.current[line.startId];
          const defElement = defRefs.current[line.endId];

          if (termElement && defElement) {
            const termRect = termElement.getBoundingClientRect();
            const defRect = defElement.getBoundingClientRect();

            return {
              ...line,
              startX: termRect.right + 10,
              startY: termRect.top + termRect.height / 2,
              endX: defRect.left - 10,
              endY: defRect.top + defRect.height / 2,
            };
          }
          return line;
        })
      );
    };

    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [lines]);

  const isComplete = items.every((item) => item.isMatched);

  useEffect(() => {
    if (isComplete && !showCompletion) {
      setShowCompletion(true);
    }
  }, [isComplete, showCompletion]);

  return (
    <div className="matching-exercise-container">
      <h1 className="matching-exercise-title">Match the definitions with the correct jargons</h1>

      <div className="matching-columns">
        {/* Terms Column */}
        <div className="terms-column">
          {items.map((item) => (
            <div
              key={`term-${item.id}`}
              ref={(el) => (termRefs.current[item.id] = el)}
              className={`term-item ${selectedTerm?.id === item.id ? 'selected' : ''} ${item.isMatched ? 'matched' : ''}`}
              onClick={() => handleTermClick(item)}
            >
              {item.term}
            </div>
          ))}
        </div>

        {/* Definitions Column */}
        <div className="definitions-column">
          {items.map((item) => (
            <div
              key={`def-${item.id}`}
              ref={(el) => (defRefs.current[item.id] = el)}
              className={`definition-item ${item.isMatched ? 'matched' : ''}`}
              onClick={() => handleDefinitionClick(item)}
            >
              {item.definition}
            </div>
          ))}
        </div>

        {/* Connecting Lines */}
        {lines.map((line, index) => (
          <MatchLine
            key={`line-${index}`}
            startX={line.startX}
            startY={line.startY}
            endX={line.endX}
            endY={line.endY}
            color={line.color}
          />
        ))}
      </div>

      {/* Reset Button */}
      <button className="reset-button" onClick={resetExercise}>Reset Exercise</button>

      {showCompletion && (
        <div className="completion-message">Congratulations! You've correctly matched all items!</div>
      )}
    </div>
  );
};

export default MatchingExercise;
