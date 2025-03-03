import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef, use } from "react";
import Navbar from "../components/Navbar";
import { determineQuestionType, findPlaceholderByValue, textTypes, numberTypes, radioTypes, QuestionType } from "../utils/questionTypeUtils";
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
  console.log("Extracted clauses:", clauses); // Debug log
  return clauses;
};

const mapQuestionsToClauses = (
  clauses: string[],
  textTypes: { [key: string]: string },
  numberTypes: { [key: string]: string },
  radioTypes: { [key: string]: string }
) => {
  const questionClauseMap: { [key: string]: string[] } = {};
  const priorityMappings: { [key: string]: string } = {
    "What's the name of the employee?": "PARTIES",
    "What's the employee's address?": "PARTIES",
    
  };

  clauses.forEach((clause) => {
    // if (clause.includes('<h2 className="text-2xl font-bold">PARTIES</h2>')) {
    //   Object.keys(textTypes).forEach((key) => {
    //     const placeholder = `[${key}]`;
    //     if (clause.includes(placeholder)) {
    //       const question = textTypes[key];
    //       if (priorityMappings.hasOwnProperty(question)) {
    //         questionClauseMap[question].push(clause);
    //         console.log(`Mapped ${question} to PARTIES clause with placeholder ${placeholder}`); // Debug log
    //       }
    //     }
    //   });
    // }

    Object.keys(textTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      
      if (clause.replace(/\s+/g, " ").includes(placeholder)) {
        if (!textTypes[key]) {
          console.error(`Error: No question mapped for ${key}`);
        }
        if (!questionClauseMap[textTypes[key]]) questionClauseMap[textTypes[key]] = [];
        questionClauseMap[textTypes[key]].push(clause);
        console.log(`Mapped ${textTypes[key]} to clause with ${placeholder}`); // Debug log
      }
    });

    Object.keys(numberTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      const question = numberTypes[key];
      if (question && clause.includes(placeholder)) {
        if (!questionClauseMap[numberTypes[key]]) questionClauseMap[numberTypes[key]] = [];
        questionClauseMap[numberTypes[key]].push(clause);
        console.log(`Mapped ${numberTypes[key]} to clause with ${placeholder}`); // Debug log
      }
    });

    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    const fullTerminatonClause = "After the probationary period, either party may terminate the employment by providing [Notice Period] written notice. The Company reserves the right to make a payment in lieu of notice. The Company may summarily dismiss the Employee without notice in cases of gross misconduct.";
    const sickPay = "The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy].";
         
    Object.keys(radioTypes).forEach((key) => {
      const placeholder = `[${key}]`;
      console.log(`Checking: key=${key}, placeholder=${placeholder}, mapped question=${textTypes[key]}`);
      console.log(`Scanning clause: "${clause}" for placeholder "${placeholder}"`);
      if (clause.includes(placeholder) || clause.includes(fullProbationClause) || clause.includes(fullTerminatonClause)) {
        if (!questionClauseMap[radioTypes[key]]) questionClauseMap[radioTypes[key]] = [];
        questionClauseMap[radioTypes[key]].push(clause);
        console.log(`Mapped ${radioTypes[key]} to clause with ${placeholder || fullProbationClause || fullTerminatonClause}`); // Debug log
      }
    });
    if (clause.includes(fullProbationClause)) {
      if (!questionClauseMap["What's the probation period length?"]) questionClauseMap["What's the probation period length?"] = [];
      questionClauseMap["What's the probation period length?"].push(clause);
      if (!questionClauseMap["What's the probation extension length?"]) questionClauseMap["What's the probation extension length?"] = [];
      questionClauseMap["What's the probation extension length?"].push(clause);
      
      console.log(`Mapped probation follow-ups to ${fullProbationClause}`); // Debug log
    }
    if (clause.includes(fullTerminatonClause)) {
      if (!questionClauseMap["What's the notice period?"]) questionClauseMap["What's the notice period?"] = [];
      questionClauseMap["What's the notice period?"].push(clause);
      
      console.log(`Mapped probation follow-ups to ${fullTerminatonClause}`); // Debug log
    }
  });

  // Fallback to ensure all highlighted questions get a clause
  Object.keys(priorityMappings).forEach((question) => {
    if (!questionClauseMap[question]) {
      questionClauseMap[question] = [];
      
      const partiesClause = clauses.find((clause) =>
        clause.includes('<h2 className="text-2xl font-bold">PARTIES</h2>')
      );
      if (partiesClause) {
        questionClauseMap[question].push(partiesClause);
        console.log(`Fallback mapped ${question} to PARTIES clause`); // Debug log
      }
    }
  });

  console.log("Final questionClauseMap:", questionClauseMap); // Debug log
  return questionClauseMap;
};

const Live_Generation = () => {
  const navigation = useNavigate();
  const { highlightedTexts } = useHighlightedText();
  const { selectedTypes } = useQuestionType();
  const [questionClauseMap, setQuestionClauseMap] = useState<{ [key: string]: string[] }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | boolean }>(initializeUserAnswers(highlightedTexts, selectedTypes));
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [highlightedPlaceholder, setHighlightedPlaceholder] = useState<{ [key: string]: boolean }>({}); // Track highlighted placeholders per question
  const [agreement, setAgreement] = useState<string>(documentText);
  const previewRefs = useRef<(HTMLDivElement | null)[]>([]); // Reintroduced
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Reintroduced

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
    if (!clause) return ""; // Return empty string if clause is undefined
    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    const probationQuestion = "Is the clause of probationary period applicable?";
    const fullTerminationClause = "After the probationary period, either party may terminate the employment by providing [Notice Period] written notice. The Company reserves the right to make a payment in lieu of notice. The Company may summarily dismiss the Employee without notice in cases of gross misconduct.";
    const terminationQuestion = "Is the termination clause applicable?";
    const sickPay = "The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy].";
    const sickPayQuestion = "Is the sick pay policy applicable?";


    if (clause.includes(fullProbationClause)) {
      const isApplicable = userAnswers[probationQuestion] as boolean || false;
      if (placeholder === "" || placeholder === probationQuestion) {
        return isApplicable ? `<div className="p-4 text-blue-600" style="opacity: 1;">${clause}</div>` : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }
      if (placeholder === "Probation Period Length" || placeholder === "Probation Extension Length" || placeholder === "one week's") {
        return isApplicable ? clause.replace(
          new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
          answer ? `<span class="${highlightedPlaceholder[placeholder] ? 'bg-lime-300' : ''}">${answer.toString().trim()}</span>` : `[${placeholder}]`
        ) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }
    }

    if (clause.includes(fullTerminationClause)) {
      const isApplicable = userAnswers[terminationQuestion] as boolean || false;
      if (placeholder === "" || placeholder === terminationQuestion) {
        return isApplicable ? `<div className="p-4 text-blue-600" style="opacity: 1;">${clause}</div>` : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }
      if (placeholder === "Notice Period") {
        return isApplicable ? clause.replace(
          new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
          answer ? `<span class="${highlightedPlaceholder[placeholder] ? 'bg-lime-300' : ''}">${answer.toString().trim()}</span>` : `[${placeholder}]`
        ) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
      }
    }
    // if (clause.includes(sickPay)) {
    //   const isApplicable = userAnswers[sickPayQuestion] as boolean || false;
    //   if (placeholder === "" || placeholder === sickPayQuestion) {
    //     return isApplicable ? `<div className="p-4 text-blue-600" style="opacity: 1;">${clause}</div>` : clause.replace(
    //       new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
    //       isApplicable 
    //         ? `[${placeholder}]` 
    //         : `<span class="text-blue-600" style="opacity: 0.2;">[${placeholder}]</span>`
    //     );;
    //   }
    //   if (placeholder === "Details of Company Sick Pay Policy") {
    //     return isApplicable ? clause.replace(
    //       new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
    //       answer ? `<span class="${highlightedPlaceholder[placeholder] ? 'bg-lime-300' : ''}">${answer.toString().trim()}</span>` : `[${placeholder}]`
    //     ) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`;
    //   }
    // }

    if (typeof answer === "boolean") {
      return answer ? (clause || "") : "";
    }
    // console.log("getUpdatedClause Debug:", { clause, placeholder, answer });

    // return `<div className="p-4 text-blue-600">${clause.replace(
    //   new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
    //   answer ? `<span class="${highlightedPlaceholder[placeholder] ? 'bg-lime-300' : ''}">${answer}</span>` : `[${placeholder}]`
    // )}</div>`;
    return `<div className="p-4 text-blue-600">${
      clause.replace(/\s+/g, " ").includes(placeholder)
          ? clause.replace(
              new RegExp(`\\[\\s*${placeholder.replace(/\s+/g, " ")}\\s*\\]`, "gi"), 
              answer ? `<span class="${highlightedPlaceholder[placeholder] ? 'bg-lime-300' : ''}">${answer}</span>` : `[${placeholder}]`
            )
          : clause
    }</div>`;
  };

  // Helper function to format date answers
  const formatDateAnswer = (answer: string): string => {
    const cleanedAnswer = answer.trim().replace(/[^0-9A-Za-z\s/]/g, '');
    if (cleanedAnswer.includes('/')) {
      const dateParts = cleanedAnswer.split('/').map(part => part.trim());
      if (dateParts.length === 3 && dateParts.every(part => !isNaN(Number(part)))) {
        const [month, day, year] = dateParts;
        const formattedMonth = month.padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const formattedYear = year.length === 2 ? `20${year}` : year;
        return `${formattedMonth}/${formattedDay}/${formattedYear}`;
      }
      return cleanedAnswer;
    }
    return cleanedAnswer;
  };

  useEffect(() => {
    const clauses = extractClauses(documentText);
    const map = mapQuestionsToClauses(clauses, textTypes, numberTypes, radioTypes);
    setQuestionClauseMap(map);
  }, []);

  useEffect(() => {
    const probationQuestion = "Is the clause of probationary period applicable?";
    const followUpQuestions = ["What's the probation period length?", "What's the probation extension length?", "How many weeks?"];
    const isProbationApplicable = userAnswers[probationQuestion] as boolean || false;
    const terminationQuestion = "Is the termination clause applicable?";
    const followUpTermination = ["What's the notice period?"];
    const isTerminationApplicable = userAnswers[terminationQuestion] as boolean || false;
    const sickPayQuestion = "Is the sick pay policy applicable?"
    const followUpSickPay = ["What's the sick pay policy?"];
    const isSickPayApplicable = userAnswers[sickPayQuestion] as boolean || false;
    const prevEmploymentQuestion = "Is the previous service applicable?";
    const followUpPrev = ["What's the previous employment start date?"];
    const isPrevApplicable = userAnswers[prevEmploymentQuestion] as boolean || false;
    const overtimeQuestion = "Does the employee receive overtime payment?";
    const followUpOvertime = ["What's the overtime pay rate?"];
    const isOvertimeApplicable = userAnswers[overtimeQuestion] as boolean || false;

    // if (!isProbationApplicable) {
    //   setSkippedQuestions(followUpQuestions);
    // } else {
    //   setSkippedQuestions([]);
    // }
    const skipped = [
      ...(isProbationApplicable ? [] : followUpQuestions), 
      ...(isTerminationApplicable ? [] : followUpTermination),
      ...(isSickPayApplicable ? [] : followUpSickPay),
      ...(isPrevApplicable ? [] : followUpPrev),
      ...(isOvertimeApplicable ? []: followUpOvertime),
    ];
  
    setSkippedQuestions(skipped);
  }, [userAnswers["Is the clause of probationary period applicable?"], 
      userAnswers["Is the termination clause applicable?"], 
      userAnswers["Is the sick pay policy applicable?"],
      userAnswers["Is the previous service applicable?"],
      userAnswers["Does the employee receive overtime payment?"]]);

  useEffect(() => {
    let updatedText = documentText;
    Object.entries(userAnswers).forEach(([question, answer]) => {
      const placeholder = findPlaceholderByValue(question); // Get the correct placeholder

      if (!placeholder) return;
      const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
      console.log("Processing answer:", { placeholder, question, answer });
      if (typeof answer === "boolean") {
        // Handle sections that should be visible/invisible based on boolean values
        if (!answer) {
          updatedText = updatedText.replace(new RegExp(`.*${escapedPlaceholder}.*`, "gi"), "");
        }
      } else {
        // Replace placeholders dynamically
        updatedText = updatedText.replace(
          new RegExp(`\\[${placeholder.replace(/\s+/g, " ")}\\]`, "gi"),
          answer ? `<span class="bg-lime-300">${answer}</span>` : `[${placeholder}]`
        );
      }
    });
  
    setAgreement(updatedText);
  }, [userAnswers]);

  const handleAnswerChange = (index: number, value: string | boolean) => {
    const { primaryValue } = determineQuestionType(highlightedTexts[index] || "");
    const currentType = selectedTypes[index] || "Text";
    const placeholder = Object.keys(textTypes).find(key => textTypes[key] === primaryValue) ||
                      Object.keys(numberTypes).find(key => numberTypes[key] === primaryValue) ||
                      Object.keys(radioTypes).find(key => radioTypes[key] === primaryValue) || "";

    console.log("Handling answer change for:", { primaryValue, value, currentType, index, placeholder });

    // Highlight the placeholder persistently for the current question
    setHighlightedPlaceholder(prev => ({
      ...prev,
      [placeholder || '']: true,
    }));

    setUserAnswers((prev) => ({
      ...prev,
      [primaryValue]: value,
    }));
  };

  const renderAnswerInput = (index: number) => {
    const questionText = highlightedTexts[index] || "";
    const { primaryValue } = determineQuestionType(questionText);
    const currentType = selectedTypes[index] || "Text";
    const answer = userAnswers[primaryValue] || (currentType === "Radio" ? false : "");
    const isProbationFollowUp = primaryValue === "What's the probation period length?" || primaryValue === "What's the probation extension length?" || primaryValue === "How many weeks?";
    const isProbationApplicable = userAnswers["Is the clause of probationary period applicable?"] === true;
    const isTerminationFollowUp = primaryValue === "What's the notice period?";
    const isTerminationApplicable = primaryValue === userAnswers["Is the termination clause applicable?"] === true;
    const isSickPayFollowUp = primaryValue === "What's the sick pay policy?";
    const isSickPayApplicable = primaryValue === userAnswers["Is the sick pay policy applicable?"] === true;
    const isPrevFollowUp = primaryValue === "What's the previous employment start date?";
    const isPrevApplicable = primaryValue === userAnswers["Is the previous service applicable?"] === true;
    const isOvertimeFollowUp = primaryValue === "What's the overtime pay rate?";
    const isOvertimeApplicable = primaryValue === userAnswers["Does the employee receive overtime payment?"] === true;

    if (isProbationFollowUp && !isProbationApplicable) {
      return (
        <div className="mt-4 p-2 w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100">
          This clause will not be populated in the Final Agreement since it has been selected as 'No'
        </div>
      );
    }
    if (isTerminationFollowUp&& isTerminationApplicable) {
      return (
        <div className="mt-4 p-2 w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100">
          This clause will not be populated in the Final Agreement since it has been selected as 'No'
        </div>
      );
    }
    if (isSickPayFollowUp && isSickPayApplicable) {
      return (
        <div className="mt-4 p-2 w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100">
          This clause will not be populated in the Final Agreement since it has been selected as 'No'
        </div>
      );
    }
    if (isPrevFollowUp && isPrevApplicable) {
      return (
        <div className="mt-4 p-2 w-full border border-gray-300 rounded-md text-gray-500 bg-gray-100">
          This clause will not be populated in the Final Agreement since it has been selected as 'No'
        </div>
      );
    }
    if (isOvertimeFollowUp && isOvertimeApplicable) {
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
            ref={el => { if (el) inputRefs.current[index] = el; }} // Safe ref assignment
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your text answer"
          />
        );
      case "Number":
        return (
          <input
            ref={el => { if (el) inputRefs.current[index] = el; }} // Safe ref assignment
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(index, formatDateAnswer(e.target.value))}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter a number or text"
          />
        );
      case "Radio":
        return (
          <div className="mt-4 flex space-x-4">
            <label>
              <input
                type="radio"
                name={`answer-${index}`}
                value="true"
                checked={answer === true}
                onChange={() => handleAnswerChange(index, true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`answer-${index}`}
                value="false"
                checked={answer === false}
                onChange={() => handleAnswerChange(index, false)}
              />
              No
            </label>
          </div>
        );
      default:
        return (
          <input
            ref={el => { if (el) inputRefs.current[index] = el; }} // Safe ref assignment
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="mt-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your answer"
          />
        );
    }
  };

  const getClauseForQuestion = (question: string, index: number): string => {
    console.log("getClauseForQuestion called with:", { question, index, questionClauseMap });
    const fullProbationClause = "The first [Probation Period Length] of employment will be a probationary period. The Company shall assess the Employee’s performance and suitability during this time. The Company may extend the probationary period by up to [Probation Extension Length] if further assessment is required. During the probationary period, either party may terminate the employment by providing [one week's] written notice. Upon successful completion, the Employee will be confirmed in their role.";
    const probationQuestion = "Is the clause of probationary period applicable?";
    const followUpQuestions = ["What's the probation period length?", "What's the probation extension length?", "How many weeks?"];
    const fullTerminatonClause = "After the probationary period, either party may terminate the employment by providing [Notice Period] written notice. The Company reserves the right to make a payment in lieu of notice. The Company may summarily dismiss the Employee without notice in cases of gross misconduct.";
    const terminationQuestion = "Is the termination clause applicable?";
    const followUpTermination = ["What's the notice period?"];
    const sickPay = "The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy].";
    const sickPayQuestion = "Is the sick pay policy applicable?";

    if (question === probationQuestion) {
      const answer = userAnswers[probationQuestion] || false;
      const clause = questionClauseMap[question] || [fullProbationClause];
      return clause.map(clause => getUpdatedClause(clause, "", answer)).join("<hr class='my-4 border-t-2 border-gray-300'/>");
      // return getUpdatedClause(clause || "", "", answer); // Ensure clause is a string
    } else if (question === terminationQuestion) {
      const answer = userAnswers[terminationQuestion] || false;
      const clause = questionClauseMap[question] || [fullTerminatonClause];
      return clause.map(clause => getUpdatedClause(clause, "", answer)).join("<hr class='my-4 border-t-2 border-gray-300'/>");
      
    } else if (followUpQuestions.includes(question)) {
      const placeholder = question === "What's the probation period length?" ? "Probation Period Length" : "Probation Extension Length";
      const isApplicable = userAnswers[probationQuestion] as boolean || false;
      const answer = userAnswers[question] || "";
      const clause = Array.isArray(questionClauseMap[question]) 
        ? questionClauseMap[question] 
        : [questionClauseMap[question] || findClauseByPlaceholder(placeholder) || ""];
      // const clause = questionClauseMap[question] || fullProbationClause || findClauseByPlaceholder(placeholder); // Fallback
      return clause.map(clause => 
        isApplicable 
            ? getUpdatedClause(clause, placeholder, answer) 
            : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause}</div>`
      ).join("<hr class='my-4 border-t-2 border-gray-300'/>");
      // return isApplicable ? getUpdatedClause(clause || "", placeholder, answer) : `<div className="p-4 text-blue-600" style="opacity: 0.2;">${clause || ""}</div>`;
    }

    const placeholder = Object.keys(textTypes).find(key => textTypes[key] === question) ||
                       Object.keys(numberTypes).find(key => numberTypes[key] === question) ||
                       Object.keys(radioTypes).find(key => radioTypes[key] === question) || "";
    const clause = questionClauseMap[question] || [findClauseByPlaceholder(placeholder) || ""];
    // let clause = questionClauseMap[question] || "";
    // if (!clause && placeholder) {
    //   clause = findClauseByPlaceholder(placeholder) || ""; // Fallback to search documentText
    // }
    return clause
  .map(clause => getUpdatedClause(clause, placeholder, userAnswers[question] || ""))
  .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
  .join("<hr class='my-4 border-t-2 border-gray-300'/>");
    // return getUpdatedClause(clause, placeholder || "", userAnswers[question] || "");
  };

  // Helper function to find clause by placeholder in documentText
  const findClauseByPlaceholder = (placeholder: string): string | undefined => {
    const sections = documentText.split("<h2");
    for (const section of sections) {
      if (section.includes(placeholder)) {
        return `<h2${section}`;
      }
    }
    return undefined;
  };

  const handleFinish = () => {
    navigation("/Finish", { state: { userAnswers } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-row w-full p-8">
          {/* Left section for questions */}
          <div className="flex flex-col w-1/2 pl-1 pr-8 sticky top-0 max-h-screen overflow-y-auto">
            {highlightedTexts.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Questions</h2>
                {highlightedTexts.map((text, index) => {
                  const { primaryValue } = determineQuestionType(text);
                  if (!skippedQuestions.includes(primaryValue || "")) {
                    return (
                      <div key={index} className="flex mb-6">
                        <div className="w-full pr-4">
                          <p className="text-lg">{primaryValue || "Unnamed Question"}</p>
                          {renderAnswerInput(index)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
                <div className="flex justify-end mt-6">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
                    onClick={handleFinish}
                  >
                    Finish
                  </button>
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
  
          {/* Right section for the agreement preview */}
          <div className="w-1/2 pl-8 bg-white rounded-lg shadow-sm border border-black-100">
            <div className="mt-4 p-4 rounded-md bg-white text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: agreement }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Live_Generation;


// original 3