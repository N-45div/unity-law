import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { determineQuestionType, textTypes, numberTypes, radioTypes } from "../utils/questionTypeUtils";
import { documentText } from "../utils/EmploymentAgreement";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";

const extractClauses = (documentText: string) => {
  const sections = documentText.split("<h2");
  const clauses: string[] = [];
  sections.forEach((section) => {
    if (section.includes("[")) {
      clauses.push(`<h2${section}`);
    }
  });
  return clauses;
};

const mapQuestionsToClauses = (
  clauses: string[],
  textTypes: { [key: string]: string },
  numberTypes: { [key: string]: string },
  radioTypes: { [key: string]: string }
) => {
  const questionClauseMap: { [key: string]: string } = {};
  const priorityMappings: { [key: string]: string } = {
    "What's the name of the employee?": "PARTIES",
    "What's the employee's address?": "PARTIES",
  };

  clauses.forEach((clause) => {
    if (clause.includes('<h2 className="text-2xl font-bold">PARTIES</h2>')) {
      Object.keys(textTypes).forEach((key) => {
        const placeholder = `[${key}]`;
        if (clause.includes(placeholder)) {
          const question = textTypes[key];
          if (priorityMappings.hasOwnProperty(question)) {
            questionClauseMap[question] = clause;
          }
        }
      });
    }

    Object.keys(textTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (!priorityMappings.hasOwnProperty(textTypes[key]) && clause.includes(placeholder)) {
        questionClauseMap[textTypes[key]] = clause;
      }
    });

    Object.keys(numberTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder)) {
        questionClauseMap[numberTypes[key]] = clause;
      }
    });

    Object.keys(radioTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder)) {
        questionClauseMap[radioTypes[key]] = clause;
      }
    });
  });

  Object.keys(priorityMappings).forEach((question) => {
    if (!questionClauseMap[question] && priorityMappings[question] === "PARTIES") {
      const partiesClause = clauses.find((clause) =>
        clause.includes('<h2 className="text-2xl font-bold">PARTIES</h2>')
      );
      if (partiesClause) {
        questionClauseMap[question] = partiesClause;
      }
    }
  });

  return questionClauseMap;
};

const Live_Generation = () => {
  const navigation = useNavigate();
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes } = useQuestionType();
  const [question, setQuestion] = useState<{ type: string; value: string }>({
    type: "Unknown",
    value: "",
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionClauseMap, setQuestionClauseMap] = useState<{ [key: string]: string }>({});
  const [userAnswer, setUserAnswer] = useState<string>("");

  useEffect(() => {
    const clauses = extractClauses(documentText);
    const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, radioTypes);
    setQuestionClauseMap(map);
  }, []);

  useEffect(() => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryType, primaryValue, alternateType, alternateValue } = determineQuestionType(questionText);
    const selectedType = selectedTypes[currentQuestionIndex] || "Text";

    let finalQuestion = { type: "Unknown", value: "" };
    if (selectedType.toLowerCase() === "text") {
      finalQuestion = { type: "Text", value: primaryValue || "" };
    } else if (selectedType.toLowerCase() === "radio" && alternateValue) {
      finalQuestion = { type: "Logic Y/N", value: alternateValue };
    } else if (selectedType.toLowerCase() === "number") {
      finalQuestion = { type: "Number", value: primaryValue || "" };
    } else {
      finalQuestion = { type: primaryType, value: primaryValue || "" };
    }
    setQuestion(finalQuestion);
    setUserAnswer("");
  }, [currentQuestionIndex, highlightedTexts, selectedTypes]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < highlightedTexts.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    const currentType = selectedTypes[currentQuestionIndex] || "Text";
    if (currentType === "Number" && !/^\d*$/.test(value)) {
      alert("Only numbers are allowed for this question.");
      return;
    }
    if (currentType === "Text" && /\d/.test(value)) {
      alert("Only text is allowed for this question, no numbers.");
      return;
    }
    setUserAnswer(value);
  };

  const updatedClause = questionClauseMap[question.value]?.replace(
    new RegExp(`\\[${highlightedTexts[currentQuestionIndex].replace(/\s+/g, " ").trim()}\\]`, "gi"),
    userAnswer || `[${highlightedTexts[currentQuestionIndex]}]`
  );

  const renderAnswerInput = () => {
    const currentType = selectedTypes[currentQuestionIndex] || "Text";
    switch (currentType) {
      case "Text":
        return (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your text answer"
          />
        );
      case "Number":
        return (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter a number"
          />
        );
      case "Radio":
        return (
          <div className="mt-4 flex space-x-4">
            <label>
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                value="Yes"
                checked={userAnswer === "Yes"}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                value="No"
                checked={userAnswer === "No"}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              No
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your answer"
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex w-full max-w-6xl">
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-4">Question</h2>
            <p>{question.value}</p>
            {renderAnswerInput()}
          </div>
          <div className="w-1/2 p-8 bg-white rounded-lg shadow-sm border border-black-100">
            <h2 className="text-blue-600 text-3xl font-bold mb-8 tracking-tight">
              EMPLOYMENT AGREEMENT
            </h2>
            <div
              className="text-blue-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: updatedClause || "No clause found for this question.",
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between px-8 py-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === highlightedTexts.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Live_Generation;