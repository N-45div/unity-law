import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import Navbar from "../components/Navbar";
import { determineQuestionType, findPlaceholderByValue } from "../utils/questionTypeUtils";
import { documentText } from "../utils/EmploymentAgreement";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import { ThemeContext } from "../context/ThemeContext";
import { useScore } from "../context/ScoreContext";

interface WarningAlertProps {
  message: string;
  isVisible: boolean;
  isDarkMode: boolean;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ message, isVisible, isDarkMode }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 right-6 p-4 rounded-xl shadow-md transition-opacity duration-500 z-50 ${
        isDarkMode
          ? "bg-gradient-to-r from-red-800 to-red-900 border-l-4 border-red-500 text-red-200"
          : "bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-400 text-red-800"
      } animate-fadeIn`}
    >
      <p className="font-bold">Warning</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

interface CertificationPopupProps {
  message: string;
  isVisible: boolean;
  isDarkMode: boolean;
  onContinue: () => void;
  onReplay: () => void;
  score: number;
}

const CertificationPopup: React.FC<CertificationPopupProps> = ({ 
  message, 
  isVisible, 
  isDarkMode, 
  onContinue,
  onReplay,
  score
}) => {
  if (!isVisible) return null;

  // Determine button configuration based on score
  const isExcellent = score > 151;
  const isFailed = score < 40;
  const isIntermediate = !isExcellent && !isFailed;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className={`p-6 rounded-xl shadow-lg max-w-md w-full mx-4 ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600" 
          : "bg-gradient-to-br from-white to-gray-100 border border-gray-200"
      }`}>
        <h3 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-teal-300" : "text-teal-700"
        }`}>
          {isFailed ? "Results" : "🎉 Congratulations!"}
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
          {message}
        </p>
        <div className={`flex ${isIntermediate ? "justify-between" : "justify-end"}`}>
          {(isFailed || isIntermediate) && (
            <button
              onClick={onReplay}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-gray-500 hover:bg-gray-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              } transition-colors duration-200`}
            >
              Replay
            </button>
          )}
          
          {(isExcellent || isIntermediate) && (
            <button
              onClick={onContinue}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-teal-500 hover:bg-teal-600 text-white"
              } transition-colors duration-200`}
            >
              Continue to Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// const extractClauses = (documentText: string) => {
//   const sections = documentText.split("<h2");
//   const clauses: string[] = [];
//   sections.forEach((section) => {
//     if (section.includes("[")) {
//       clauses.push(`<h2${section}`);
//     }
//   });
//   return clauses;
// };

// const mapQuestionsToClauses = (
//   clauses: string[],
//   textTypes: { [key: string]: string },
//   numberTypes: { [key: string]: string },
//   dateTypes: { [key: string]: string },
//   radioTypes: { [key: string]: string }
// ) => {
//   const questionClauseMap: { [key: string]: string[] } = {};
//   clauses.forEach((clause) => {
//     Object.keys(textTypes).forEach((key) => {
//       const placeholder = `[${key}]`;
//       if (clause.includes(placeholder)) {
//         if (!questionClauseMap[textTypes[key]]) questionClauseMap[textTypes[key]] = [];
//         questionClauseMap[textTypes[key]].push(clause);
//       }
//     });
//     Object.keys(numberTypes).forEach((key) => {
//       const placeholder = `[${key}]`;
//       if (clause.includes(placeholder)) {
//         if (!questionClauseMap[numberTypes[key]]) questionClauseMap[numberTypes[key]] = [];
//         questionClauseMap[numberTypes[key]].push(clause);
//       }
//     });
//     Object.keys(dateTypes).forEach((key) => {
//       const placeholder = `[${key}]`;
//       if (clause.includes(placeholder)) {
//         if (!questionClauseMap[dateTypes[key]]) questionClauseMap[dateTypes[key]] = [];
//         questionClauseMap[dateTypes[key]].push(clause);
//       }
//     });
//     Object.keys(radioTypes).forEach((key) => {
//       if (clause.includes(key)) {
//         if (!questionClauseMap[radioTypes[key]]) questionClauseMap[radioTypes[key]] = [];
//         questionClauseMap[radioTypes[key]].push(clause);
//       }
//     });
//   });
//   return questionClauseMap;
// };

const Live_Generation_2 = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes, setSelectedTypes, editedQuestions, setEditedQuestions, requiredQuestions } = useQuestionType();
  // const [questionClauseMap, setQuestionClauseMap] = useState<{ [key: string]: string[] }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | boolean }>(initializeUserAnswers(highlightedTexts, selectedTypes));
  // const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [agreement, setAgreement] = useState<string>(documentText);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});
  const [showWarning, setShowWarning] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [additionalLocations, setAdditionalLocations] = useState<string[]>([]);
  const [locations] = useState<string[]>([]);
  
  const { totalScore } = useScore();
  const [showCertificationPopup, setShowCertificationPopup] = useState(false);
  const [certificationMessage, setCertificationMessage] = useState("");
  const [isCertified, setIsCertified] = useState(false);

  useEffect(() => {
    const processedTexts: string[] = [];
    const questionMap = new Map();

    for (const text of highlightedTexts) {
      const { primaryValue } = determineQuestionType(text);
      if (primaryValue && !questionMap.has(primaryValue)) {
        questionMap.set(primaryValue, text);
        processedTexts.push(text);
      }
    }
    console.log("processed texts: ", processedTexts);
      const initialTexts = processedTexts.map(
        (text) => determineQuestionType(text).primaryValue || "No text selected"
      );
      const initialTypes = processedTexts.map((text) => {
        const { primaryType } = determineQuestionType(text);
        return primaryType !== "Unknown" ? primaryType : "Text";
      });
      console.log("initial texts: ", initialTexts);
      console.log("initial types: ", initialTypes);
      setSelectedTypes(initialTypes);
      setEditedQuestions(initialTexts);
  }, [highlightedTexts, selectedTypes.length, editedQuestions.length, setSelectedTypes, setEditedQuestions]);
  useEffect(() => {

    console.log("selected types: ", selectedTypes);
    console.log("edited questions: ", editedQuestions);
  }, [editedQuestions, selectedTypes]);

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

  // useEffect(() => {
  //   const clauses = extractClauses(documentText);
  //   const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, dateTypes, radioTypes);
  //   setQuestionClauseMap(map);
  // }, []);

  // useEffect(() => {
  //   const probationQuestion = "Is the clause of probationary period applicable?";
  //   const followUpQuestions = ["What's the probation period length?", "What's the probation extension length?", "How many weeks?"];
  //   const isProbationApplicable = userAnswers[probationQuestion] as boolean || false;

  //   const terminationQuestion = "Is the termination clause applicable?";
  //   const followUpTermination = ["What's the notice period?"];
  //   const isTerminationApplicable = userAnswers[terminationQuestion] as boolean || false;

  //   const sickPayQuestion = "Is the sick pay policy applicable?";
  //   const followUpSickPay = ["What's the sick pay policy?"];
  //   const isSickPayApplicable = userAnswers[sickPayQuestion] as boolean || false;

  //   const prevEmploymentQuestion = "Is the previous service applicable?";
  //   const followUpPrev = ["What's the previous employment start date?"];
  //   const isPrevApplicable = userAnswers[prevEmploymentQuestion] as boolean || false;

  //   const overtimeQuestion = "Does the employee receive overtime payment?";
  //   const followUpOvertime = ["What's the overtime pay rate?"];
  //   const isOvertimeApplicable = userAnswers[overtimeQuestion] as boolean || false;

  //   const skipped = [
  //     ...(isProbationApplicable ? [] : followUpQuestions),
  //     ...(isTerminationApplicable ? [] : followUpTermination),
  //     ...(isSickPayApplicable ? [] : followUpSickPay),
  //     ...(isPrevApplicable ? [] : followUpPrev),
  //     ...(isOvertimeApplicable ? [] : followUpOvertime),
  //   ].filter((q) => q !== "What's the sick pay policy?");

  //   setSkippedQuestions(skipped);
  // }, [
  //   userAnswers["Is the clause of probationary period applicable?"],
  //   userAnswers["Is the termination clause applicable?"],
  //   userAnswers["Is the sick pay policy applicable?"],
  //   userAnswers["Is the previous service applicable?"],
  //   userAnswers["Does the employee receive overtime payment?"],
  // ]);

  useEffect(() => {
    let updatedText = documentText;
    
    Object.entries(userAnswers).forEach(([question, answer]) => {
      const placeholder = findPlaceholderByValue(question);

      if (placeholder === "Unused Holiday Days" && typeof(answer) === "string") {
        console.log("here");
        const storedOperationType = localStorage.getItem("operationType");
        const storedOperationValue = localStorage.getItem("operationValue");
        const operationValue = storedOperationValue ? parseFloat(storedOperationValue) : null;
        console.log("operation value: ", operationValue);
        let calculatedValue = null;
        let floatAnswer = parseFloat(answer).toFixed(2);
        const numericAnswer = parseFloat(floatAnswer);
        console.log("numeric answer: ", numericAnswer);
        if (storedOperationType && operationValue !== null) {
          console.log("in if statmeent");
          switch (storedOperationType.toLowerCase()) {
            case "add":
              calculatedValue = numericAnswer + operationValue;
              break;
            case "subtract":
              calculatedValue = numericAnswer - operationValue;
              break;
            case "multiply":
              calculatedValue = numericAnswer * operationValue;
              break;
            case "divide":
              calculatedValue = operationValue !== 0 ? numericAnswer / operationValue : "Error"; // Prevent division by zero
              break;
            default:
              calculatedValue = null;
          }
        }
        console.log("calculatedvalue: ", calculatedValue);
        localStorage.setItem("calculatedValue", calculatedValue !== null ? String(calculatedValue) : "0");

        updatedText = updatedText.replace(
          new RegExp("\\[Holiday Pay\\]", "gi"),
          `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${calculatedValue}</span>`
        );
      }

      if (placeholder) {
        const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
        if (typeof answer === "boolean") {
          if (!answer) {
            updatedText = updatedText.replace(new RegExp(`.*${escapedPlaceholder}.*`, "gi"), "");
          } else {
            updatedText = updatedText.replace(
              new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
              answer ? "Yes" : "No"
            );
          }
        } else if (typeof answer === "string" && answer.trim()) {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${answer}</span>`
          );
        } else {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            `[${placeholder}]`
          );
        }
      } else {
        if (question === "Is the sick pay policy applicable?") {
          const sickPayClause = "{The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy]}";
          if (answer === false) {
            updatedText = updatedText.replace(sickPayClause, "");
          } else if (answer === true && userAnswers["What's the sick pay policy?"]) {
            updatedText = updatedText.replace(
              "[Details of Company Sick Pay Policy]",
              `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${userAnswers["What's the sick pay policy?"] as string}</span>`
            );
          }
        } else if (question === "Is the clause of probationary period applicable?") {
          if (answer === false) {
            const probationSection = updatedText.match(/<h2[^>]*>PROBATIONARY PERIOD<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
            if (probationSection) {
              const sectionWithoutClause = probationSection[0].replace(/\(The first.*?confirmed in their role\.\)/, '');
              updatedText = updatedText.replace(probationSection[0], sectionWithoutClause);
            }
          }
        } else if (question === "Is the termination clause applicable?") {
          if (answer === false) {
            const terminationSection = updatedText.match(/<h2[^>]*>TERMINATION<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i);
            if (terminationSection) {
              const sectionWithoutClause = terminationSection[0].replace(/\(After the probationary period.*?gross misconduct\.\)/, '');
              updatedText = updatedText.replace(terminationSection[0], sectionWithoutClause);
            }
          } else if (answer === true && userAnswers["What's the notice period?"]) {
            updatedText = updatedText.replace(
              /\[Notice Period\]/gi,
              `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${userAnswers["What's the notice period?"] as string}</span>`
            );
          }
        } else if (question === "Is the previous service applicable?" && answer === false) {
          const prevEmploymentClause = 'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"';
          updatedText = updatedText.replace(new RegExp(`\\s*${prevEmploymentClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        } else if (question === "Does the employee receive overtime payment?" && answer === false) {
          const overtimeYesClause = "{The Employee is entitled to overtime pay at a rate of [Overtime Pay Rate] for authorized overtime work}";
          updatedText = updatedText.replace(new RegExp(`\\s*${overtimeYesClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        } else if (question === "Should the employee not receive overtime payment?" && answer === false) {
          const overtimeNoClause = "{The Employee shall not receive additional payment for overtime worked}";
          updatedText = updatedText.replace(new RegExp(`\\s*${overtimeNoClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        }
      }
    });

    setAgreement(updatedText + " ");
  }, [userAnswers, isDarkMode]);

  const validateInput = (type: string, value: string): string => {
    if (!value) return "";
    switch (type) {
      case "Number":
        if (!/^\d*\.?\d*$/.test(value)) {
          return "Please enter a valid number.";
        }
        break;
      case "Date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return "Please enter a valid date in YYYY-MM-DD format.";
        }
        break;
      case "Email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address.";
        }
        break;
      case "Text":
      case "Paragraph":
        break;
      default:
        break;
    }
    return "";
  };

  const handleAnswerChange = useCallback(
    (
      index: number,
      value: string | boolean,
      followUpQuestion?: string,
      isAdditional?: boolean,
      locationNum?: number
    ) => {
      const { primaryValue } = determineQuestionType(highlightedTexts[index] || "");
      if (!primaryValue) return;
  
      const currentType = selectedTypes[index] || "Text";
  
      if (typeof value === "string" && currentType !== "Radio") {
        const error = validateInput(currentType, value);
        setInputErrors((prev) => ({
          ...prev,
          [primaryValue]: error,
        }));
      }
  
      const finalValue = currentType === "Radio" ? Boolean(value) : value;
  
      if (isAdditional && locationNum !== undefined) {
        setUserAnswers((prev) => {
          const currentValue = prev[primaryValue];
          let stringValue = "";
          
          if (typeof currentValue === 'string') {
            stringValue = currentValue;
          } else if (typeof currentValue === 'boolean') {
            stringValue = currentValue.toString();
          }
          
          let values = stringValue
            .split(/\s*,\s*|\s*and\s*|\s*, and\s*/)
            .filter(Boolean);
          
          values[locationNum] = String(finalValue);
          values = values.filter((v) => v.trim() !== "");
          
          let updatedAnswer = values.length === 1 
            ? values[0] 
            : values.length === 2 
            ? values.join(" and ") 
            : `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
          
          return {
            ...prev,
            [primaryValue]: updatedAnswer,
          };
        });
      } else {
        if (primaryValue === "What is the additional work location?" && typeof finalValue === "string") {
          locations[0] = finalValue;
        }
        setUserAnswers((prev) => {
          const newAnswers = {
            ...prev,
            [primaryValue]: finalValue,
          };
          if (followUpQuestion && finalValue === true) {
            newAnswers[followUpQuestion] = "";
          }
          return newAnswers;
        });
      }
    },
    [highlightedTexts, selectedTypes]
  );
  
  const handleAddMore = () => {
    setAdditionalLocations((prevLocations) => [...prevLocations, ""]);
  };
  
  const handleLocationChange = (index: number, value: string) => {
    setAdditionalLocations((prevLocations) => {
      const updatedLocations = [...prevLocations];
      updatedLocations[index] = value;
      return updatedLocations;
    });
  };

  const areAllRequiredAnswered = () => {
    for (let index = 0; index < highlightedTexts.length; index++) {
      const { primaryValue } = determineQuestionType(highlightedTexts[index] || "");
      const isRequired = requiredQuestions[index] || false;
      const currentType = selectedTypes[index] || "Text";
      const answer = userAnswers[primaryValue];

      if (isRequired) {
        if (currentType === "Radio") {
          if (answer === undefined) return false;
        } else if (typeof answer === "string" && !answer.trim()) {
          return false;
        } else if (inputErrors[primaryValue]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleContinueToDocument = () => {
    setShowCertificationPopup(false);
    navigate("/Finish", { state: { userAnswers } });
  };

  const handleFinish = () => {
    if (!areAllRequiredAnswered()) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
      return;
    }
  
    const flag = totalScore >= 40;
    let message = "";
    
    if (totalScore >= 171) {
      message = "Congratulations! You've achieved Level 3 Pro certification (Excellent Performance)";
    } else if (totalScore >= 120) {
      message = "Congratulations! You've achieved Calculation Expert certification";
    } else if (totalScore >= 70) {
      message = "Congratulations! You've achieved Loop Master certification";
    } else {
      message = "Please retry the exercise to improve your accuracy.";
    }
  
    setCertificationMessage(message);
    setShowCertificationPopup(true);
    setIsCertified(flag);
  };

  const renderAnswerInput = (index: number) => {
    const questionText = highlightedTexts[index] || "";
    const { primaryValue } = determineQuestionType(questionText);
    if (!primaryValue) return null;

    const currentType = selectedTypes[index] || "Text";
    const answer = userAnswers[primaryValue] !== undefined ? userAnswers[primaryValue] : (currentType === "Radio" ? false : "");
    const error = inputErrors[primaryValue] || "";
    const isAdditionalLocationQuestion =
    primaryValue === "What is the additional work location?";
    let includeAdditional = userAnswers["Does the employee need to work at additional locations besides the normal place of work?"] !== undefined
    ? userAnswers["Does the employee need to work at additional locations besides the normal place of work?"]
    : true;

    return (
      <div key={index} className="mb-8">
        <div className="w-full">
          {includeAdditional || !isAdditionalLocationQuestion ? (
            <p className={`text-lg font-medium ${isDarkMode ? "text-teal-200" : "text-teal-900"}`}>
              {editedQuestions[index] || primaryValue || "Unnamed Question"}
              {requiredQuestions[index] && <span className="text-red-500 ml-2">*</span>}
            </p>
          ) : null}
          {currentType === "Radio" ? (
            primaryValue === "Is the sick pay policy applicable?" ? (
              <>
                <div className="mt-4 flex space-x-6">
                  <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                    <input
                      type="radio"
                      checked={answer === true}
                      onChange={() => handleAnswerChange(index, true, "What's the sick pay policy?")}
                      className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                    />
                    <span>Yes</span>
                  </label>
                  <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                    <input
                      type="radio"
                      checked={answer === false}
                      onChange={() => handleAnswerChange(index, false)}
                      className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                    />
                    <span>No</span>
                  </label>
                </div>
                {answer === true && (
                  <input
                    type="text"
                    value={(userAnswers["What's the sick pay policy?"] as string) || ""}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        "What's the sick pay policy?": e.target.value,
                      }))
                    }
                    className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200 placeholder-teal-300/70"
                        : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800 placeholder-teal-400/70"
                    }`}
                    placeholder="What's the sick pay policy?"
                  />
                )}
              </>
            ) : (
              <div className="mt-4 flex space-x-6">
                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  <input
                    type="radio"
                    checked={answer === true}
                    onChange={() => handleAnswerChange(index, true)}
                    className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                  />
                  <span>Yes</span>
                </label>
                <label className={`flex items-center space-x-2 cursor-pointer ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  <input
                    type="radio"
                    checked={answer === false}
                    onChange={() => handleAnswerChange(index, false)}
                    className={`cursor-pointer ${isDarkMode ? "text-teal-500 focus:ring-teal-400" : "text-teal-600 focus:ring-teal-500"}`}
                  />
                  <span>No</span>
                </label>
              </div>
            )
          ) : currentType === "Number" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="number"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter a number"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Date" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="date"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800`
                }`}
                placeholder="Select a date"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Email" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="email"
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter an email address"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : includeAdditional && currentType === "Text" ? (
            <>
              <input
                ref={(el) => { if (el) inputRefs.current[index] = el; }}
                type="text"
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter your answer"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : currentType === "Paragraph" ? (
            <>
              <textarea
                ref={(el) => { if (el) inputRefs.current[index] = el as any; }}
                value={(userAnswers[primaryValue] as string) || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDarkMode
                    ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                    : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
                }`}
                placeholder="Enter your answer"
                rows={3}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : (
            <>
            </>
          )}
          {isAdditionalLocationQuestion && 
          userAnswers["Does the employee need to work at additional locations besides the normal place of work?"] === true 
          && (
          <>
            {additionalLocations.map((location, idx) => (
              <div key={idx} className="mt-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    handleLocationChange(idx, newValue);
                    handleAnswerChange(index, newValue, undefined, true, idx + 1); 
                  }}
                  className={`mt-4 p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200 placeholder-teal-300/70"
                      : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800 placeholder-teal-400/70"
                  }`}
                  placeholder="Enter additional location"
                />
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                className={`px-6 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ${
                  isDarkMode ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800" : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
                }`}
                onClick={handleAddMore}
              >
                Add More Locations
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    );
  };

  const storedLevel = sessionStorage.getItem("level") ?? "/Level-Two-Part-Two";
  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar 
        level={storedLevel} 
        questionnaire="/Questionnaire" 
        live_generation="/Live_Generation_2" 
        {...(storedLevel === "/Level-Three-Quiz" ? { calculations: "/Calculations" } : {})}
      />
      <div className={`fixed top-14 right-2 p-2 rounded-lg shadow-md z-50 ${
        isDarkMode 
          ? "bg-gray-700/90 text-teal-300" 
          : "bg-white/90 text-teal-700"
      }`}>
        <p className="font-bold">Score: {totalScore}</p>
      </div>
      <div className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="flex flex-row w-full max-w-7xl">
          <div
            className={`flex flex-col w-1/2 pl-4 pr-8 sticky top-12 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl shadow-lg border p-6 ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-700/70 to-gray-800/70 border-gray-700/20"
                : "bg-gradient-to-b from-teal-50/50 to-cyan-50/50 border-teal-100/20"
            }`}
          >
            {highlightedTexts.length > 0 ? (
              <>
                <h2 className={`text-2xl font-semibold mb-6 tracking-wide ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  Questions
                </h2>
                {highlightedTexts.map((_, index) => renderAnswerInput(index))}
                <div className="flex justify-end mt-8">
                  <button
                    className={`relative px-6 py-3 rounded-lg shadow-md transform transition-all duration-300 flex items-center space-x-2 ${
                      areAllRequiredAnswered()
                        ? isDarkMode
                          ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white hover:scale-105"
                          : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white hover:scale-105"
                        : isDarkMode
                        ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300/50 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={handleFinish}
                    disabled={!areAllRequiredAnswered()}
                  >
                    <span>Finish</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg font-medium ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
                  No questions have been generated yet.
                </p>
                <p className={`text-sm mt-3 ${isDarkMode ? "text-teal-400" : "text-teal-500"}`}>
                  Please go to the Questionnaire tab, create or select questions from the Document tab, and then return here to answer them and generate a live document preview.
                </p>
              </div>
            )}
          </div>
          <div
            className={`w-1/2 pl-8 rounded-xl shadow-lg border ${
              isDarkMode
                ? "bg-gray-800/90 backdrop-blur-sm border-gray-700/20"
                : "bg-white/90 backdrop-blur-sm border-teal-100/20"
            }`}
          >
            <div className={`mt-6 p-6 ${isDarkMode ? "text-teal-200" : "text-teal-900"}`}>
              <div dangerouslySetInnerHTML={{ __html: agreement }} />
            </div>
          </div>
        </div>
      </div>
      <WarningAlert
        message="Please answer all required questions marked with an asterisk (*)."
        isVisible={showWarning}
        isDarkMode={isDarkMode}
      />
      <CertificationPopup
        message={certificationMessage}
        isVisible={showCertificationPopup}
        isDarkMode={isDarkMode}
        onContinue={handleContinueToDocument}
        onReplay={() => window.location.href = storedLevel}
        score={totalScore}
      />
    </div>
  );
};

export default Live_Generation_2;