import { FaPenToSquare } from "react-icons/fa6";
import { TbSettingsMinus, TbSettingsPlus } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import EmploymentAgreement from "../utils/EmploymentAgreement";
import { determineQuestionType } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";
import { useScore } from '../context/ScoreContext';

const icons = [
  { icon: <FaPenToSquare />, label: "Edit PlaceHolder" },
  { icon: <TbSettingsMinus />, label: "Small Condition" },
  { icon: <TbSettingsPlus />, label: "Big Condition" },
  { icon: <ImLoop2 />, label: "Loop" },
];

const LevelTwoPart_Two = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { highlightedTexts, addHighlightedText } = useHighlightedText();
  const { selectedTypes } = useQuestionType();
  
  // Added scoring system from validation branch
  const { setLevelTwoScore } = useScore();
  const [score, setScore] = useState<number>(0);
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [foundPlaceholders, setFoundPlaceholders] = useState<string[]>([]);
  const [foundSmallConditions, setFoundSmallConditions] = useState<string[]>([]);
  const [foundBigConditions, setFoundBigConditions] = useState<string[]>([]);

  useEffect(() => {
    setLevelTwoScore(score);
  }, [score, setLevelTwoScore]);

  const handleIconClick = (label: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let textWithoutBrackets = selectedText;
    let hasValidBrackets = false;
    let isSmallCondition = false;
    let isBigCondition = false;

    // Check for square brackets (placeholders)
    if (selectedText.startsWith("[") && selectedText.endsWith("]")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      hasValidBrackets = true;
    }
    // Check for curly braces (small conditions)
    else if (selectedText.startsWith("{") && selectedText.endsWith("}")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      isSmallCondition = true;
    }
    // Check for parentheses (big conditions)
    else if (selectedText.startsWith("(") && selectedText.endsWith(")")) {
      textWithoutBrackets = selectedText.slice(1, -1);
      isBigCondition = true;
    } else {
      console.log("Selected text does not have valid brackets:", selectedText);
      return;
    }

    // Added scoring validation from validation branch
    const isCorrectButton = 
      (label === "Edit PlaceHolder" && hasValidBrackets) ||
      (label === "Small Condition" && isSmallCondition) ||
      (label === "Big Condition" && isBigCondition);

    // Handle scoring
    if (isCorrectButton) {
      // Correct button clicked
      if (label === "Edit PlaceHolder" && !foundPlaceholders.includes(textWithoutBrackets)) {
        setScore(prevScore => prevScore + 3);
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundPlaceholders(prev => [...prev, textWithoutBrackets]);
      }
      else if (label === "Small Condition" && !foundSmallConditions.includes(textWithoutBrackets)) {
        setScore(prevScore => prevScore + 3);
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundSmallConditions(prev => [...prev, textWithoutBrackets]);
      }
      else if (label === "Big Condition" && !foundBigConditions.includes(textWithoutBrackets)) {
        setScore(prevScore => prevScore + 3);
        setScoreChange(3);
        setTimeout(() => setScoreChange(null), 2000);
        setFoundBigConditions(prev => [...prev, textWithoutBrackets]);
      }
    } else {
      // Wrong button clicked - deduct 2 points
      const newScore = Math.max(0, score - 2);
      setScore(newScore);
      // Only show -2 animation if score was above 0 before deduction
      if (score > 0) {
        setScoreChange(-2);
        setTimeout(() => setScoreChange(null), 2000);
      }
      return;
    }

    // Handle highlighting and adding to context
    if (label === "Edit PlaceHolder") {
      if (!hasValidBrackets) return;
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(255, 245, 157, 0.5)" : "rgba(255, 245, 157, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } 
    else if (label === "Small Condition") {
      if (!isSmallCondition || selectedText.length < 35 || selectedText.length > 450) return;
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(129, 236, 236, 0.5)" : "rgba(129, 236, 236, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } 
    else if (label === "Big Condition") {
      if (!isBigCondition) return;
      
      let clauseContent = textWithoutBrackets;
      const headingsToStrip = ["PROBATIONARY PERIOD", "PENSION"];
      for (const heading of headingsToStrip) {
        if (textWithoutBrackets.startsWith(heading)) {
          clauseContent = textWithoutBrackets.slice(heading.length).trim();
          break;
        }
      }

      addHighlightedText(clauseContent);

      const fragment = document.createDocumentFragment();
      const contents = range.cloneContents();
      
      const applyHighlight = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const span = document.createElement("span");
          span.style.backgroundColor = isDarkMode ? "rgba(186, 220, 88, 0.5)" : "rgba(186, 220, 88, 0.7)";
          span.textContent = node.textContent;
          return span;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          const newElement = document.createElement(element.tagName);
          for (const attr of element.attributes) {
            newElement.setAttribute(attr.name, attr.value);
          }
          element.childNodes.forEach((child) => {
            const newChild = applyHighlight(child);
            if (newChild) {
              newElement.appendChild(newChild);
            }
          });
          return newElement;
        }
        return null;
      };

      contents.childNodes.forEach((node) => {
        const newNode = applyHighlight(node);
        if (newNode) {
          fragment.appendChild(newNode);
        }
      });

      range.deleteContents();
      range.insertNode(fragment);
    } 
    else if (label === "Loop") {
      addHighlightedText(textWithoutBrackets);
      const span = document.createElement("span");
      span.style.backgroundColor = isDarkMode ? "rgba(255, 245, 157, 0.5)" : "rgba(255, 245, 157, 0.7)";
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    }
  };

  return (
    <div
      className={`w-full min-h-screen font-sans transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar />
      
      {/* Score Display - Added from validation branch */}
      <div className="fixed top-16 left-0 z-50 px-6 py-3">
        <div className="relative">
          <div className={`p-3 rounded-full shadow-lg flex items-center ${
            isDarkMode 
              ? "bg-gray-700 text-white" 
              : "bg-teal-500 text-white"
          }`}>
            <span className="font-bold mr-2">Score:</span> {score}
            {scoreChange !== null && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className={`absolute -top-6 right-0 text-sm font-bold ${
                  scoreChange > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar Buttons */}
      <div className="fixed flex top-16 right-0 z-50 px-6 py-3 space-x-6">
        {icons.map(({ icon, label }, index) => (
          <div key={index} className="relative flex items-center">
            <button
              className={`p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center text-2xl ${
                isDarkMode
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
                  : "bg-gradient-to-r from-teal-400 to-cyan-400 text-white hover:from-teal-500 hover:to-cyan-500"
              }`}
              onMouseEnter={() => setTooltip(label)}
              onMouseLeave={() => setTooltip(null)}
              onClick={() => handleIconClick(label)}
            >
              {icon}
            </button>
            {tooltip === label && (
              <div
                className={`absolute -left-10 top-full mt-2 px-3 py-1 text-sm text-white rounded-lg shadow-lg whitespace-nowrap animate-fadeIn ${
                  isDarkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-800"
                    : "bg-gradient-to-r from-gray-800 to-gray-900"
                }`}
              >
                {label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Placeholders Section */}
      <div
        className={`max-w-5xl mx-auto p-8 rounded-3xl shadow-2xl border mt-24 transform transition-all duration-500 hover:shadow-3xl ${
          isDarkMode
            ? "bg-gray-800/90 backdrop-blur-lg border-gray-700/50"
            : "bg-white/90 backdrop-blur-lg border-teal-100/30"
        }`}
      >
        <h2
          className={`text-2xl font-semibold mb-6 tracking-wide ${
            isDarkMode ? "text-teal-300" : "text-teal-700"
          }`}
        >
          ☑️ Selected Placeholders
        </h2>
        {highlightedTexts.length > 0 ? (
          <ul
            className={`space-y-3 p-5 rounded-xl shadow-inner ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
                : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
            }`}
          >
            {highlightedTexts.map((text, index) => {
              const { primaryValue } = determineQuestionType(text);
              const questionType = selectedTypes[index] || "Text";
              return (
                <li
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                    isDarkMode
                      ? "text-teal-200 bg-gray-600/80 hover:bg-gray-500/70"
                      : "text-teal-800 bg-white/80 hover:bg-teal-100/70"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`mr-3 text-lg ${
                        isDarkMode ? "text-cyan-400" : "text-cyan-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span className="text-sm font-medium truncate max-w-xs">
                      {primaryValue || text}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "text-gray-300 bg-gray-500/50"
                        : "text-gray-600 bg-teal-100/50"
                    }`}
                  >
                    Type: {questionType}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            className={`text-center py-8 rounded-xl shadow-inner ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-700/70 via-gray-800/70 to-gray-900/70"
                : "bg-gradient-to-r from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
            }`}
          >
            <p
              className={`italic text-lg ${
                isDarkMode ? "text-teal-400" : "text-teal-600"
              }`}
            >
              No placeholders selected yet
            </p>
          </div>
        )}
        {highlightedTexts.length > 0 && (
          <div className="mt-5 text-right">
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                isDarkMode
                  ? "text-teal-300 bg-gray-600/50"
                  : "text-teal-600 bg-teal-100/50"
              }`}
            >
              Total Placeholders: {highlightedTexts.length}
            </span>
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className="max-w-5xl mx-auto mt-10 px-8 pb-20">
        <div
          className={`p-6 rounded-3xl shadow-xl border ${
            isDarkMode
              ? "bg-gray-800/80 backdrop-blur-md border-gray-700/20 bg-gradient-to-br from-gray-700/70 via-gray-800/70 to-gray-900/70"
              : "bg-white/80 backdrop-blur-md border-teal-100/20 bg-gradient-to-br from-teal-50/70 via-cyan-50/70 to-indigo-50/70"
          }`}
        >
          <EmploymentAgreement />
        </div>
      </div>
    </div>
  );
};

export default LevelTwoPart_Two;