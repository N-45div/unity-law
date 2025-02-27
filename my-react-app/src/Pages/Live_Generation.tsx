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

    // Handle radio types, including the full probationary clause and its related questions
    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    Object.keys(radioTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder) || clause.includes(fullProbationClause)) {
        questionClauseMap[radioTypes[key]] = clause;
      }
    });
    // Map follow-up questions to the same clause with their placeholders
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
  const [question, setQuestion] = useState<{ type: QuestionType; value: string }>({
    type: "Unknown",
    value: "",
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionClauseMap, setQuestionClauseMap] = useState<{ [key: string]: string }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | boolean }>(initializeUserAnswers(highlightedTexts, selectedTypes));
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);

  // Helper function to initialize userAnswers with default values
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

  // Helper function to update the clause based on the answer
  const getUpdatedClause = (clause: string, placeholder: string, answer: string | boolean): string => {
    console.log("getUpdatedClause called with:", { clause, placeholder, answer }); // Debug log
    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    const probationQuestion = "Is the clause of probationary period applicable?";

    // Check if the clause is the probationary clause or its follow-ups
    if (clause.includes(fullProbationClause)) {
      const isApplicable = userAnswers[probationQuestion] as boolean || false;
      console.log("Probation clause check:", { isApplicable, placeholder });

      if (placeholder === "" || placeholder === probationQuestion) { // For the main probationary question
        return isApplicable ? `<div className="p-4 text-blue-600" style="opacity: 1;">${clause}</div>` : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }

      if (placeholder === "Probation Period Length" || placeholder === "Probation Extension Length") { // For follow-up questions
        return isApplicable ? clause.replace(
          new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
          answer ? answer.toString().trim() : `[${placeholder}]`
        ) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }
    }

    // Handle all other clauses (non-probationary) normally
    if (typeof answer === "boolean") {
      return answer ? clause : "";
    }
    return `<div className="p-4 text-blue-600" style="opacity: 1;">${clause.replace(
      new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
      answer || `[${placeholder}]`
    )}</div>`;
  };

  // Helper function to format date answers (optional, kept for consistency, but not used for text like "1 month")
  const formatDateAnswer = (answer: string): string => {
    const cleanedAnswer = answer.trim().replace(/[^0-9A-Za-z\s/]/g, ''); // Remove special characters except numbers, letters, spaces, and slashes
    if (cleanedAnswer.includes('/')) {
      const dateParts = cleanedAnswer.split('/').map(part => part.trim());
      if (dateParts.length === 3 && dateParts.every(part => !isNaN(Number(part)))) {
        const [month, day, year] = dateParts;
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const formattedYear = year.length === 2 ? `20${year}` : year; // Assume 2-digit year is 20XX
        return `${formattedMonth}/${formattedDay}/${formattedYear}`;
      }
      return cleanedAnswer; // Return as-is if not a valid date, preserving text like "1 month"
    }
    return cleanedAnswer; // Return cleaned text for non-date inputs like "1 month"
  };

  useEffect(() => {
    const clauses = extractClauses(documentText);
    const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, radioTypes);
    setQuestionClauseMap(map);
  }, []);

  useEffect(() => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryType, primaryValue } = determineQuestionType(questionText);
    const selectedType = selectedTypes[currentQuestionIndex] || primaryType;

    let finalQuestion = { type: "Unknown" as QuestionType, value: "" };
    if (selectedType === "Text") {
      finalQuestion = { type: "Text", value: primaryValue || "" };
    } else if (selectedType === "Number") {
      finalQuestion = { type: "Number", value: primaryValue || "" };
    } else if (selectedType === "Radio") {
      finalQuestion = { type: "Radio", value: primaryValue || "" };
    }
    setQuestion(finalQuestion);
  }, [currentQuestionIndex, highlightedTexts, selectedTypes]);

  // Separate useEffect for handling probationary clause and skipped questions
  useEffect(() => {
    const probationQuestion = "Is the clause of probationary period applicable?";
    const followUpQuestions = ["What's the probation period length?", "What's the probation extension length?"];
    const isApplicable = userAnswers[probationQuestion] as boolean || false;

    if (!isApplicable) {
      setSkippedQuestions(followUpQuestions); // Set skipped questions only if "No" is selected
    } else {
      setSkippedQuestions([]); // Clear skipped questions if "Yes" is selected
    }
  }, [userAnswers["Is the clause of probationary period applicable?"]]); // Only depend on the probation question answer

  const handleNextQuestion = () => {
    if (currentQuestionIndex < highlightedTexts.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = highlightedTexts[nextIndex] || "";
      const { primaryValue } = determineQuestionType(nextQuestion);
      if (skippedQuestions.includes(primaryValue)) {
        if (nextIndex < highlightedTexts.length - 1) {
          setCurrentQuestionIndex(nextIndex + 1);
        } else {
          setCurrentQuestionIndex(nextIndex);
        }
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string | boolean) => {
    const { primaryValue } = determineQuestionType(highlightedTexts[currentQuestionIndex] || "");
    const currentType = selectedTypes[currentQuestionIndex] || "Text";

    console.log("Handling answer change for:", { primaryValue, value, currentType }); // Debug log

    setUserAnswers((prev) => ({
      ...prev,
      [primaryValue]: value,
    }));
  };

  // Helper function to get the correct clause for the current question with conditional opacity
  const getClauseForQuestion = (question: string, questionClauseMap: { [key: string]: string }, userAnswers: { [key: string]: string | boolean }): string => {
    console.log("getClauseForQuestion called with:", { question, userAnswers }); // Debug log
    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    const probationQuestion = "Is the clause of probationary period applicable?";
    const followUpQuestions = ["What's the probation period length?", "What's the probation extension length?"];

    // Handle probationary clause and its follow-ups
    if (question === probationQuestion) {
      const answer = userAnswers[probationQuestion] || false;
      return getUpdatedClause(questionClauseMap[probationQuestion] || fullProbationClause, "", answer);
    } else if (followUpQuestions.includes(question)) {
      const placeholder = question === "What's the probation period length?" ? "Probation Period Length" : "Probation Extension Length";
      const isApplicable = userAnswers[probationQuestion] as boolean || false;
      const answer = userAnswers[question] || "";
      return isApplicable ? getUpdatedClause(questionClauseMap[question] || fullProbationClause, placeholder, answer) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${questionClauseMap[question] || fullProbationClause}</div>`;
    }

    // Handle all other questions (non-probationary) normally
    const placeholder = Object.keys(textTypes).find(key => textTypes[key] === question) ||
                       Object.keys(numberTypes).find(key => numberTypes[key] === question) ||
                       Object.keys(radioTypes).find(key => radioTypes[key] === question) || "";
    return getUpdatedClause(questionClauseMap[question] || "", placeholder || "", userAnswers[question] || "");
  };

  const finalDocument = () => {
    let updatedDoc = documentText;
    Object.entries(userAnswers).forEach(([question, answer]) => {
      const placeholder = Object.keys(textTypes).find(key => textTypes[key] === question) ||
                         Object.keys(numberTypes).find(key => numberTypes[key] === question) ||
                         Object.keys(radioTypes).find(key => radioTypes[key] === question) || "";
      if (placeholder && questionClauseMap[question]) {
        const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
        if (question === "Is the clause of probationary period applicable?" && answer === false) {
          updatedDoc = updatedDoc.replace(new RegExp(questionClauseMap[question], "g"), ""); // Remove the clause entirely
        } else {
          updatedDoc = updatedDoc.replace(questionClauseMap[question], getUpdatedClause(questionClauseMap[question], placeholder, answer));
        }
      }
    });
    return updatedDoc;
  };

  const renderAnswerInput = () => {
    const questionText = highlightedTexts[currentQuestionIndex] || "";
    const { primaryValue } = determineQuestionType(questionText);
    const currentType = selectedTypes[currentQuestionIndex] || "Text";
    const answer = userAnswers[primaryValue] || (currentType === "Radio" ? false : "");
    const isProbationFollowUp = primaryValue === "What's the probation period length?" || primaryValue === "What's the probation extension length?";
    const isProbationApplicable = userAnswers["Is the clause of probationary period applicable?"] === true;

    if (isProbationFollowUp && !isProbationApplicable) {
      return (
        <div className="mt-4 p-2 w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100">
          This clause will not be populated in the Final Agreement since it has been selected as 'No'
        </div>
      );
    }

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
            type="text" // Allow both text and numbers (e.g., dates)
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter a number or text (e.g., date in MM/DD/YYYY or DD/MM/YYYY)"
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
          {highlightedTexts.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center py-10 w-full">
              <p className="text-gray-600">No questions have been generated yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Please go to the Questionnaire tab, create or select questions from the Document tab, and then return here to answer them and generate a live document preview.
              </p>
            </div>
          )}
        </div>
      </div>
      {highlightedTexts.length > 0 && (
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
      )}
    </div>
  );
};

export default Live_Generation;



// original