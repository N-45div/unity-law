import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { determineQuestionType, textTypes, numberTypes, radioTypes, QuestionType } from "../utils/questionTypeUtils";
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

    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    Object.keys(radioTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder) || clause.includes(fullProbationClause)) {
        questionClauseMap[radioTypes[key]] = clause;
      }
    });
    if (clause.includes(fullProbationClause)) {
      questionClauseMap["What's the probation period length?"] = clause;
      questionClauseMap["What's the probation extension length?"] = clause;
    }
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
  const [questionTexts] = useState<string[]>([]); // Assuming questionTexts is managed in Questionnaire
  const [question, setQuestion] = useState<{ type: QuestionType; value: string }>({
    type: "Unknown",
    value: "",
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionClauseMap, setQuestionClauseMap] = useState<{ [key: string]: string }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | boolean }>(initializeUserAnswers(highlightedTexts, selectedTypes));

  function initializeUserAnswers(highlightedTexts: string[], selectedTypes: (string | null)[]): { [key: string]: string | boolean } {
    const initialAnswers: { [key: string]: string | boolean } = {};
    highlightedTexts.forEach((text, index) => {
      const { primaryValue } = determineQuestionType(text);
      const type = selectedTypes[index] || "Text";
      if (primaryValue) {
        initialAnswers[primaryValue] = type === "Radio" ? false : "";
      }
    });
    return initialAnswers;
  }

  const getUpdatedClause = (clause: string, placeholder: string, answer: string | boolean): string => {
    if (typeof answer === "boolean") {
      return answer ? clause : "";
    }
    return clause.replace(
      new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
      answer || `[${placeholder}]`
    );
  };

  useEffect(() => {
    const clauses = extractClauses(documentText);
    const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, radioTypes);
    setQuestionClauseMap(map);
  }, []);

  useEffect(() => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryType } = determineQuestionType(questionText);
    const selectedType = selectedTypes[currentQuestionIndex] || primaryType;
    const editedQuestion = questionTexts[currentQuestionIndex] || determineQuestionType(questionText).primaryValue || "";

    let finalQuestion = { type: "Unknown" as QuestionType, value: "" };
    if (selectedType === "Text") {
      finalQuestion = { type: "Text", value: editedQuestion };
    } else if (selectedType === "Number") {
      finalQuestion = { type: "Number", value: editedQuestion };
    } else if (selectedType === "Radio") {
      finalQuestion = { type: "Radio", value: editedQuestion };
    }
    setQuestion(finalQuestion);
  }, [currentQuestionIndex, highlightedTexts, selectedTypes, questionTexts]);

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

  const handleAnswerChange = (value: string | boolean) => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryValue } = determineQuestionType(questionText);
    const currentType = selectedTypes[currentQuestionIndex] || "Text";

    if (currentType === "Number" && typeof value === "string" && !/^\d+$/.test(value)) {
      alert("Please enter a valid number for this question.");
      return;
    }
    if (currentType === "Radio" && typeof value !== "boolean") {
      alert("Please select Yes or No for this question.");
      return;
    }

    setUserAnswers((prev) => ({
      ...prev,
      [primaryValue]: value,
    }));
  };

  const getClauseForQuestion = (question: string, questionClauseMap: { [key: string]: string }, userAnswers: { [key: string]: string | boolean }): string => {
    const placeholder = highlightedTexts[currentQuestionIndex];
    const answer = userAnswers[determineQuestionType(placeholder).primaryValue] || "";
    return questionClauseMap[question] ? getUpdatedClause(questionClauseMap[question], placeholder, answer) : "";
  };

  const finalDocument = () => {
    let updatedDoc = documentText;
    highlightedTexts.forEach((text, index) => {
      const { primaryValue } = determineQuestionType(text);
      const answer = userAnswers[primaryValue];
      const question = questionTexts[index] || primaryValue;
      const placeholder = text;
      if (questionClauseMap[question] && answer !== undefined) {
        updatedDoc = updatedDoc.replace(
          questionClauseMap[question],
          getUpdatedClause(questionClauseMap[question], placeholder, answer)
        );
      }
    });
    return updatedDoc;
  };

  const renderAnswerInput = () => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryValue } = determineQuestionType(questionText);
    const currentType = selectedTypes[currentQuestionIndex] || "Text";
    const answer = userAnswers[primaryValue] || (currentType === "Radio" ? false : "");

    switch (currentType) {
      case "Text":
        return (
          <input
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your text answer"
          />
        );
      case "Number":
        return (
          <input
            type="text"
            value={typeof answer === "string" ? answer : ""}
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
                value="true"
                checked={answer === true}
                onChange={() => handleAnswerChange(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`answer-${currentQuestionIndex}`}
                value="false"
                checked={answer === false}
                onChange={() => handleAnswerChange(false)}
              />
              No
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
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
              Clause Preview
            </h2>
            <div
              className="text-blue-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: useMemo(() => getClauseForQuestion(question.value, questionClauseMap, userAnswers) || "", [question.value, questionClauseMap, userAnswers]),
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