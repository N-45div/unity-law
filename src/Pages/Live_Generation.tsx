import React, { useContext, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { determineQuestionType, findPlaceholderByValue, textTypes, numberTypes, dateTypes, radioTypes } from "../utils/questionTypeUtils";
import { documentText } from "../utils/EmploymentAgreement";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { useQuestionType } from "../context/QuestionTypeContext";
import { ThemeContext } from "../context/ThemeContext";
import parse, { DOMNode, Element } from "html-react-parser";
import { useLocation } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

// Warning Alert Component
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
  dateTypes: { [key: string]: string },
  radioTypes: { [key: string]: string }
) => {
  const questionClauseMap: { [key: string]: string[] } = {};
  clauses.forEach((clause) => {
    Object.keys(textTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder)) {
        if (!questionClauseMap[textTypes[key]]) questionClauseMap[textTypes[key]] = [];
        questionClauseMap[textTypes[key]].push(clause);
      }
    });
    Object.keys(numberTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder)) {
        if (!questionClauseMap[numberTypes[key]]) questionClauseMap[numberTypes[key]] = [];
        questionClauseMap[numberTypes[key]].push(clause);
      }
    });
    Object.keys(dateTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      if (clause.includes(placeholder)) {
        if (!questionClauseMap[dateTypes[key]]) questionClauseMap[dateTypes[key]] = [];
        questionClauseMap[dateTypes[key]].push(clause);
      }
    });
    Object.keys(radioTypes).forEach((key) => {
      if (clause.includes(key)) {
        if (!questionClauseMap[radioTypes[key]]) questionClauseMap[radioTypes[key]] = [];
        questionClauseMap[radioTypes[key]].push(clause);
      }
    });
  });
  return questionClauseMap;
};

// Function to remove optional clauses from the initial document text
const getBaseDocumentText = (fullText: string): string => {
  let baseText = fullText;
  const probationSection = baseText.match(/<div>\s*<!--\s*Wrapper for each clause section\s*-->\s*<h2[^>]*>\(PROBATIONARY PERIOD<\/h2>\s*<p>[\s\S]*?\(Optional Clause\)<\/span><\/p>\s*<\/div>/i);
  if (probationSection) {
    baseText = baseText.replace(probationSection[0], "");
  }
  const pensionSection = baseText.match(/<div>\s*<!--\s*Wrapper for each clause section\s*-->\s*<h2[^>]*>\(PENSION<\/h2>\s*<p>[\s\S]*?<\/p>\s*<\/div>/i);
  if (pensionSection) {
    baseText = baseText.replace(pensionSection[0], "");
  }
  return baseText;
};

const Live_Generation = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes, editedQuestions, requiredQuestions, questionOrder } = useQuestionType();
  const [, setQuestionClauseMap] = React.useState<{ [key: string]: string[] }>({});
  const [userAnswers, setUserAnswers] = React.useState<{ [key: string]: any }>(initializeUserAnswers(highlightedTexts, selectedTypes));
  const [skippedQuestions, setSkippedQuestions] = React.useState<string[]>([]);
  const [agreement, setAgreement] = React.useState<string>(getBaseDocumentText(documentText));
  const [inputErrors, setInputErrors] = React.useState<{ [key: string]: string }>({});
  const [showWarning, setShowWarning] = React.useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  console.log("highlightedTexts in Live_Generation:", highlightedTexts);
  console.log("editedQuestions in Live_Generation:", editedQuestions);
  console.log("questionOrder in Live_Generation:", questionOrder);

  function initializeUserAnswers(highlightedTexts: string[], selectedTypes: (string | null)[]): { [key: string]: any } {
    const initialAnswers: { [key: string]: any } = {};
    highlightedTexts.forEach((text, index) => {
      const { primaryValue } = determineQuestionType(text);
      const type = selectedTypes[index] || "Text";
      if (primaryValue) {
        if (primaryValue === "What's the annual salary?") {
          initialAnswers[primaryValue] = { amount: "", currency: "USD" };
        } else if (primaryValue === "Specify the holiday pay?") {
          initialAnswers[primaryValue] = { amount: "", currency: "USD" };
        } else {
          initialAnswers[primaryValue] = type === "Radio" ? undefined : "";
        }
      }
    });
    initialAnswers["What's the notice period?"] = "";
    initialAnswers["What's the sick pay policy?"] = "";
    initialAnswers["What's the previous employment start date?"] = "";
    initialAnswers["What's the overtime pay rate?"] = "";
    initialAnswers["Who is the HR/Relevant Contact?"] = "";
    initialAnswers["What's the probation period length?"] = "";
    return initialAnswers;
  }

  useEffect(() => {
    if (!location.state?.startTour) return;
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: "shadow-md bg-purple-dark",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: true,
    });

    tour.addStep({
      id: "welcome",
      text: "Welcome to the Live Document Generation Page! Here, you can answer questions and see the document update in real-time.",
      attachTo: { element: "body", on: "bottom-start" },
      classes: "shepherd-theme-arrows",
      buttons: [{ text: "Next →", action: tour.next }],
    });

    tour.addStep({
      id: "questions-section",
      text: "<strong>Answer the questions here. </strong> Your answers will automatically update the document on the right.",
      attachTo: { element: "#questions-section", on: "bottom" },
      buttons: [{ text: "Next →", action: tour.next }],
    });

    tour.addStep({
      id: "document-preview",
      text: "This is the live document preview. It updates as you answer the questions.",
      attachTo: { element: "#document-preview", on: "bottom" },
      classes: "shepherd-theme-arrows",
      buttons: [{ text: "Next →", action: tour.next }],
    });

    tour.addStep({
      id: "finish-button",
      text: "Once you've answered all questions, click 'Finish' 🎯 to generate the final document.",
      attachTo: { element: "#finish-button", on: "bottom" },
      classes: "introjs-tooltip-bottom-center",
      buttons: [{ text: "Done", action: tour.complete }],
    });

    tour.start();

    return () => {
      tour.complete();
    };
  }, [location.state]);

  useEffect(() => {
    const clauses = extractClauses(documentText);
    const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, dateTypes, radioTypes);
    setQuestionClauseMap(map);
  }, []);

  useEffect(() => {
    const skipped = [];
    if ("Is the sick pay policy applicable?" in userAnswers) {
      const isSickPayApplicable = userAnswers["Is the sick pay policy applicable?"] as boolean | undefined;
      if (isSickPayApplicable !== true) skipped.push("What's the sick pay policy?");
    }
    if ("Is the previous service applicable?" in userAnswers) {
      const isPrevApplicable = userAnswers["Is the previous service applicable?"] as boolean | undefined;
      if (isPrevApplicable !== true) skipped.push("What's the previous employment start date?");
    }
    if ("Does the employee receive overtime payment?" in userAnswers) {
      const isOvertimeApplicable = userAnswers["Does the employee receive overtime payment?"] as boolean | undefined;
      if (isOvertimeApplicable !== true) skipped.push("What's the overtime pay rate?");
    }
    if ("Is the Pension clause applicable?" in userAnswers) {
      const isPensionApplicable = userAnswers["Is the Pension clause applicable?"] as boolean | undefined;
      if (isPensionApplicable !== true) skipped.push("Who is the HR/Relevant Contact?");
    }
    if ("Is the clause of probationary period applicable?" in userAnswers) {
      const isProbationApplicable = userAnswers["Is the clause of probationary period applicable?"] as boolean | undefined;
      if (isProbationApplicable !== true) skipped.push("What's the probation period length?");
    }
    if ("Would unused holidays would be paid for if employee is termination?" in userAnswers) {
      const isUnusedHolidaysApplicable = userAnswers["Would unused holidays would be paid for if employee is termination?"] as boolean | undefined;
      if (isUnusedHolidaysApplicable !== true) {
        skipped.push("Specify the holiday pay?");
        skipped.push("Specify the number of unused holidays?");
      }
    }
    setSkippedQuestions(skipped);
  }, [userAnswers]);

  useEffect(() => {
    let updatedText = getBaseDocumentText(documentText);

    const probationSection = `
      <div>
        <!-- Wrapper for each clause section -->
        <h2 className="text-2xl font-bold mt-6">(PROBATIONARY PERIOD</h2>
        <p>The first [Probation Period Length]* months of employment will be a probationary period. The Company shall assess the Employee's performance and suitability during this time. Upon successful completion, the Employee will be confirmed in their role.) <span className="text-black font-bold">(Optional Clause)</span></p>
      </div>
    `;
    const pensionSection = `
      <div>
        <!-- Wrapper for each clause section -->
        <h2 className="text-2xl font-bold mt-6">(PENSION</h2>
        <p>The Employee will be enrolled in the Company's pension scheme in accordance with auto-enrolment legislation.)</p>
      </div>
    `;

    Object.entries(userAnswers).forEach(([question, answer]) => {
      console.log(`Processing question: ${question}, answer: ${answer}`);

      if (question === "Is the clause of probationary period applicable?") {
        if (answer === true) {
          const jobTitleIndex = updatedText.indexOf('<h2 className="text-2xl font-bold mt-6">JOB TITLE AND DUTIES</h2>');
          if (jobTitleIndex !== -1) {
            updatedText = updatedText.slice(0, jobTitleIndex) + probationSection + updatedText.slice(jobTitleIndex);
          } else {
            updatedText += probationSection;
          }
        }
      }

      if (question === "Is the Pension clause applicable?") {
        if (answer === true) {
          const terminationIndex = updatedText.indexOf('<h2 className="text-2xl font-bold mt-6">TERMINATION CLAUSE</h2>');
          if (terminationIndex !== -1) {
            updatedText = updatedText.slice(0, terminationIndex) + pensionSection + updatedText.slice(terminationIndex);
          } else {
            updatedText += pensionSection;
          }
        }
      }

      if (question === "Is the employee entitled to overtime work?") {
        const overtimeYesClause = "{The Employee is entitled to overtime pay for authorized overtime work}";
        const overtimeNoClause = "{The Employee shall not receive additional payment for overtime worked}";

        updatedText = updatedText.replace(
          /<p className="mt-5" id="employment-agreement-working-hours">([\s\S]*?)<\/p>/i,
          () => {
            let replacementText = "";

            if (answer === true) {
              replacementText = `${overtimeYesClause}`;
            } else if (answer === false) {
              replacementText = `${overtimeNoClause}`;
            }

            return `<p className="mt-5" id="employment-agreement-working-hours">${replacementText}</p>`;
          }
        );
      }
      if (question === "Is the Employee required to perform additional duties as part of their employment?") {
        const rawClause = "The Employee may be required to perform additional duties as reasonably assigned by the Company.";

        const flexibleClauseRegex = new RegExp(
          `[\\{]?\\s*${rawClause.split(" ").map(word => `${word}\\s*`).join("")}[\\}]?`,
          "g"
        );

        updatedText = updatedText.replace(flexibleClauseRegex, "");

        if (answer === true) {
          const jobTitleSectionRegex = /<h2[^>]*>JOB TITLE AND DUTIES<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i;
          const match = updatedText.match(jobTitleSectionRegex);

          if (match) {
            const existingText = match[1].trim();
            const clauseToInsert = ` {${rawClause}}`;
            const updatedParagraph = existingText + clauseToInsert;
            updatedText = updatedText.replace(match[0], match[0].replace(existingText, updatedParagraph));
          }
        }
      }

      if (question === "Would unused holidays would be paid for if employee is termination?") {
        const rawClause = "Upon termination, unused leave will be paid. For [Unused Holiday Days] unused days, the holiday pay is [Holiday Pay] [USD].";

        const flexibleClauseRegex = new RegExp(
          `[\\{]?\\s*${rawClause.split(" ").map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*').join('')}[\\}]?`,
          "g"
        );

        updatedText = updatedText.replace(flexibleClauseRegex, "");

        if (answer === true) {
          const holidaySectionRegex = /<h2[^>]*>HOLIDAY ENTITLEMENT<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i;
          const match = updatedText.match(holidaySectionRegex);

          if (match) {
            const existingText = match[1].trim();
            let modifiedClause = rawClause;

            // Replace the placeholders with actual values if they exist
            const unusedHolidaysAnswer = userAnswers["Specify the number of unused holidays?"];
            const holidayPayAnswer = userAnswers["Specify the holiday pay?"] as { amount: string; currency: string } | undefined;

            if (unusedHolidaysAnswer) {
              modifiedClause = modifiedClause.replace(
                "[Unused Holiday Days]",
                `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${unusedHolidaysAnswer}</span>`
              );
            }

            if (holidayPayAnswer?.amount) {
              const formattedHolidayPay = `${holidayPayAnswer.amount} ${holidayPayAnswer.currency}`;
              modifiedClause = modifiedClause.replace(
                "[Holiday Pay]",
                `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${formattedHolidayPay}</span>`
              );
              modifiedClause = modifiedClause.replace("[USD]", "");
            }

            const clauseToInsert = ` {${modifiedClause}}`;
            const updatedParagraph = existingText + clauseToInsert;
            updatedText = updatedText.replace(match[0], match[0].replace(existingText, updatedParagraph));
          }
        }
      }

      if (question === "Would the Employee be entitled to Company Sick Pay?") {
        const rawClause = "The Employee may also be entitled to Company sick pay.";

        const flexibleClauseRegex = new RegExp(
          `[\\{]?\\s*${rawClause.split(" ").map(word => word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&") + "\\s*").join("")}[\\}]?`,
          "g"
        );

        updatedText = updatedText.replace(flexibleClauseRegex, "");

        if (answer === true) {
          const sickPaySectionRegex = /<h2[^>]*>SICKNESS ABSENCE<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i;
          const match = updatedText.match(sickPaySectionRegex);

          if (match) {
            const existingText = match[1].trim();
            const clauseToInsert = ` {${rawClause}}`;
            const updatedParagraph = existingText + clauseToInsert;
            updatedText = updatedText.replace(match[0], match[0].replace(existingText, updatedParagraph));
          }
        }
      }

      if (question === "Does the employee need to work at additional locations besides the normal place of work?") {
        const rawClause = "/The Employee may be required to work at [other locations]./";

        const flexibleClauseRegex = new RegExp(
          `[\\{]?\\s*${rawClause.split(" ").map(word => word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&") + "\\s*").join("")}[\\}]?`,
          "g"
        );

        updatedText = updatedText.replace(flexibleClauseRegex, "");

        if (answer === true) {
          const placeOfWorkRegex = /<h2[^>]*>PLACE OF WORK<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i;
          const match = updatedText.match(placeOfWorkRegex);

          if (match) {
            const existingText = match[1].trim();
            const clauseToInsert = ` {${rawClause}}`;
            const updatedParagraph = existingText + clauseToInsert;
            updatedText = updatedText.replace(match[0], match[0].replace(existingText, updatedParagraph));
          }
        }
      }

      const placeholder = findPlaceholderByValue(question);

      if (placeholder) {
        const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
        if (question === "What's the annual salary?") {
          const salaryData = userAnswers[question] || { amount: "[Annual Salary]", currency: "USD" };
          const formattedSalary = `${salaryData.amount} ${salaryData.currency}`;
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${formattedSalary}</span>`
          );
          updatedText = updatedText.replace("[USD]*", "");
        } else if (typeof answer === "boolean" && question !== "Is the clause of probationary period applicable?" && question !== "Is the Pension clause applicable?") {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            answer ? "Yes" : "No"
          );
        } else if (typeof answer === "string" && answer.trim()) {
          const occurrences = (updatedText.match(new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi")) || []).length;
          for (let i = 0; i < occurrences; i++) {
            updatedText = updatedText.replace(
              new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "i"),
              `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${answer}</span>`
            );
          }
        } else {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
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
        } else if (question === "Is the previous service applicable?" && answer === false) {
          const prevEmploymentClause = 'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"';
          updatedText = updatedText.replace(new RegExp(`\\s*${prevEmploymentClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
        }
      }

      // Handle the Unused Holiday Days placeholder
      if (question === "Specify the number of unused holidays?") {
        const escapedPlaceholder = "Unused Holiday Days".replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
        if (typeof answer === "string" && answer.trim()) {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${answer}</span>`
          );
        } else {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            "[Unused Holiday Days]"
          );
        }
      }

      // Handle the Holiday Pay placeholder
      if (question === "What's the holiday pay amount?") {
        const escapedPlaceholder = "Holiday Pay".replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
        if (typeof answer === "string" && answer.trim()) {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            `<span class="${isDarkMode ? "bg-teal-600/70 text-teal-100" : "bg-teal-200/70 text-teal-900"} px-1 rounded">${answer}</span>`
          );
        } else {
          updatedText = updatedText.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]\\*`, "gi"),
            "[Holiday Pay]"
          );
        }
      }
    });

    setAgreement(updatedText + " ");
  }, [userAnswers, isDarkMode]);

  const validateInput = (type: string, value: string, _question: string): string => {
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

  const renderAnswerInput = useCallback((originalIndex: number, displayIndex: number) => {
    const text = highlightedTexts[originalIndex];
    const { primaryValue } = determineQuestionType(text);
    if (!primaryValue) return null;

    const isRequired = requiredQuestions[originalIndex] || false;
    const currentType = selectedTypes[originalIndex] || "Text";
    const questionText = editedQuestions[originalIndex] || primaryValue;
    const answer = userAnswers[primaryValue];
    const error = inputErrors[primaryValue];

    // Handle both Annual Salary and Holiday Pay with currency dropdown
    if (primaryValue === "What's the annual salary?" || primaryValue === "Specify the holiday pay?") {
      const answerWithCurrency = answer as { amount: string; currency: string } | undefined;
      const amount = answerWithCurrency?.amount || "";
      const currency = answerWithCurrency?.currency || "USD";

      return (
        <div key={originalIndex} id="questions-section" className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
            {questionText} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                setUserAnswers((prev) => ({
                  ...prev,
                  [primaryValue]: { ...prev[primaryValue], amount: value },
                }));
                const error = validateInput("Number", value, primaryValue);
                setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
              }}
              ref={(el) => {
                inputRefs.current[displayIndex] = el;
              }}
              className={`p-3 w-1/2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDarkMode
                  ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                  : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
              }`}
              placeholder="Enter amount"
            />
            <select
              value={currency}
              onChange={(e) => {
                setUserAnswers((prev) => ({
                  ...prev,
                  [primaryValue]: { ...prev[primaryValue], currency: e.target.value },
                }));
              }}
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-700/80 border border-teal-600 focus:ring-teal-400 text-teal-200"
                  : "bg-white/80 border border-teal-200 focus:ring-teal-500 text-teal-800"
              }`}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="SEK">SEK</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    // Handle Radio type questions
    if (currentType === "Radio") {
      return (
        <div key={originalIndex} id="questions-section" className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
            {questionText} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={primaryValue}
                checked={answer === true}
                onChange={() => {
                  setUserAnswers((prev) => ({ ...prev, [primaryValue]: true }));
                  setInputErrors((prev) => ({ ...prev, [primaryValue]: "" }));
                }}
                className={`form-radio h-5 w-5 ${isDarkMode ? "text-teal-400" : "text-teal-600"} focus:ring-0`}
              />
              <span className={isDarkMode ? "text-teal-200" : "text-teal-800"}>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name={primaryValue}
                checked={answer === false}
                onChange={() => {
                  setUserAnswers((prev) => ({ ...prev, [primaryValue]: false }));
                  setInputErrors((prev) => ({ ...prev, [primaryValue]: "" }));
                }}
                className={`form-radio h-5 w-5 ${isDarkMode ? "text-teal-400" : "text-teal-600"} focus:ring-0`}
              />
              <span className={isDarkMode ? "text-teal-200" : "text-teal-800"}>No</span>
            </label>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    // Handle Number type questions
    if (currentType === "Number") {
      return (
        <div key={originalIndex} id="questions-section" className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
            {questionText} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            type="number"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => {
              const value = e.target.value;
              setUserAnswers((prev) => ({ ...prev, [primaryValue]: value }));
              const error = validateInput(currentType, value, primaryValue);
              setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
            }}
            ref={(el) => {
              inputRefs.current[displayIndex] = el;
            }}
            className={`p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
              isDarkMode
                ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
            }`}
            placeholder="Enter a number"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    // Handle Date type questions
    if (currentType === "Date") {
      return (
        <div key={originalIndex} id="questions-section" className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
            {questionText} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => {
              const value = e.target.value;
              setUserAnswers((prev) => ({ ...prev, [primaryValue]: value }));
              const error = validateInput(currentType, value, primaryValue);
              setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
            }}
            ref={(el) => {
              inputRefs.current[displayIndex] = el;
            }}
            className={`p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
              isDarkMode
                ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200`
                : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800`
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    // Handle Paragraph type questions
    if (currentType === "Paragraph") {
      return (
        <div key={originalIndex} id="questions-section" className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
            {questionText} {isRequired && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => {
              const value = e.target.value;
              setUserAnswers((prev) => ({ ...prev, [primaryValue]: value }));
              const error = validateInput(currentType, value, primaryValue);
              setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
            }}
            className={`p-3 w-full h-32 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-y ${
              isDarkMode
                ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
                : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
            }`}
            placeholder={`Enter ${primaryValue.toLowerCase()}`}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    // Default to Text or Email type
    return (
      <div key={originalIndex} id="questions-section" className="mb-6">
        <label className={`block text-lg font-medium mb-2 ${isDarkMode ? "text-teal-300" : "text-teal-700"}`}>
          {questionText} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <input
          type={currentType === "Email" ? "email" : "text"}
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => {
            const value = e.target.value;
            setUserAnswers((prev) => ({ ...prev, [primaryValue]: value }));
            const error = validateInput(currentType, value, primaryValue);
            setInputErrors((prev) => ({ ...prev, [primaryValue]: error }));
          }}
          ref={(el) => {
            inputRefs.current[displayIndex] = el;
          }}
          className={`p-3 w-full rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDarkMode
              ? `bg-gray-700/80 border ${error ? "border-red-400" : "border-teal-600"} focus:ring-teal-400 text-teal-200 placeholder-teal-300/70`
              : `bg-white/80 border ${error ? "border-red-400" : "border-teal-200"} focus:ring-teal-500 text-teal-800 placeholder-teal-400/70`
          }`}
          placeholder={`Enter ${primaryValue.toLowerCase()}`}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }, [highlightedTexts, selectedTypes, requiredQuestions, userAnswers, inputErrors, editedQuestions, isDarkMode, validateInput]);

  const areAllRequiredAnswered = () => {
    for (let displayIndex = 0; displayIndex < questionOrder.length; displayIndex++) {
      const originalIndex = questionOrder[displayIndex];
      const { primaryValue } = determineQuestionType(highlightedTexts[originalIndex] || "");
      const isRequired = requiredQuestions[originalIndex] || false;
      const currentType = selectedTypes[originalIndex] || "Text";
      const answer = userAnswers[primaryValue];

      if (isRequired) {
        if (primaryValue === "What's the annual salary?") {
          if (!answer?.amount || !answer.amount.trim()) return false;
        } else if (currentType === "Radio") {
          if (answer === undefined) return false;
        } else if (typeof answer === "string" && !answer.trim()) {
          return false;
        } else if (inputErrors[primaryValue]) {
          return false;
        }
      }

      if (primaryValue === "Is the Pension clause applicable?" && answer === true) {
        const hrContactIndex = highlightedTexts.indexOf("[HR/Relevant Contact]");
        if (hrContactIndex !== -1 && requiredQuestions[hrContactIndex]) {
          const followUpAnswer = userAnswers["Who is the HR/Relevant Contact?"];
          if (!followUpAnswer || (typeof followUpAnswer === "string" && !followUpAnswer.trim())) return false;
          if (inputErrors["Who is the HR/Relevant Contact?"]) return false;
        }
      }

      if (primaryValue === "Is the sick pay policy applicable?" && answer === true) {
        const sickPayIndex = highlightedTexts.indexOf("[Details of Company Sick Pay Policy]");
        if (sickPayIndex !== -1 && requiredQuestions[sickPayIndex]) {
          const followUpAnswer = userAnswers["What's the sick pay policy?"];
          if (!followUpAnswer || (typeof followUpAnswer === "string" && !followUpAnswer.trim())) return false;
          if (inputErrors["What's the sick pay policy?"]) return false;
        }
      }

      if (primaryValue === "Is the clause of probationary period applicable?" && answer === true) {
        const probationPeriodIndex = highlightedTexts.indexOf("Probation Period Length");
        if (probationPeriodIndex !== -1 && requiredQuestions[probationPeriodIndex]) {
          const followUpAnswer = userAnswers["What's the probation period length?"];
          if (!followUpAnswer || (typeof followUpAnswer === "string" && !followUpAnswer.trim())) return false;
          if (inputErrors["What's the probation period length?"]) return false;
        }
      }

      // Add validation for unused holidays follow-up questions
      if (primaryValue === "Would unused holidays would be paid for if employee is termination?" && answer === true) {
        const holidayPayIndex = highlightedTexts.indexOf("[Holiday Pay]");
        const unusedHolidayDaysIndex = highlightedTexts.indexOf("[Unused Holiday Days]");
        
        if (holidayPayIndex !== -1 && requiredQuestions[holidayPayIndex]) {
          const holidayPayAnswer = userAnswers["Specify the holiday pay?"];
          if (!holidayPayAnswer?.amount || (typeof holidayPayAnswer.amount === "string" && !holidayPayAnswer.amount.trim())) return false;
          if (inputErrors["Specify the holiday pay?"]) return false;
        }

        if (unusedHolidayDaysIndex !== -1 && requiredQuestions[unusedHolidayDaysIndex]) {
          const unusedHolidaysAnswer = userAnswers["Specify the number of unused holidays?"];
          if (!unusedHolidaysAnswer || (typeof unusedHolidaysAnswer === "string" && !unusedHolidaysAnswer.trim())) return false;
          if (inputErrors["Specify the number of unused holidays?"]) return false;
        }
      }
    }
    return true;
  };

  const handleFinish = () => {
    if (!areAllRequiredAnswered()) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
      return;
    }
    navigate("/Finish", { state: { userAnswers } });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      <Navbar />
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
                {questionOrder.map((originalIndex, displayIndex) => {
                  const text = highlightedTexts[originalIndex];
                  const { primaryValue } = determineQuestionType(text);
                  if (!primaryValue || skippedQuestions.includes(primaryValue)) return null;
                  return renderAnswerInput(originalIndex, displayIndex);
                })}
                <div className="flex justify-end mt-8">
                  <button
                    id="finish-button"
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
                    {!areAllRequiredAnswered()}
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
            <div className="mt-6 p-6">
              {parse(agreement, {
                replace: (domNode: DOMNode) => {
                  if (domNode instanceof Element && domNode.attribs) {
                    const className = domNode.attribs.className || "";
                    if (className.includes("bg-white")) {
                      domNode.attribs.className = "bg-white rounded-lg shadow-sm border border-black-100 p-8";
                    }
                    if (className.includes("text-blue-600 leading-relaxed")) {
                      domNode.attribs.className = "text-blue-600 leading-relaxed space-y-6";
                    }
                  }
                  return domNode;
                },
              })}
            </div>
          </div>
        </div>
      </div>
      <WarningAlert
        message="Please answer all required questions marked with an asterisk (*)."
        isVisible={showWarning}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Live_Generation;
