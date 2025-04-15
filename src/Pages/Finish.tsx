import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router";
import Confetti from "react-confetti";
import parse from "html-react-parser";
import { documentText } from "../utils/EmploymentAgreement";
import { findPlaceholderByValue } from "../utils/questionTypeUtils";
import { ThemeContext } from "../context/ThemeContext";

interface UserAnswers {
  [key: string]: string | boolean;
}

const processAgreement = (html: string, answers: UserAnswers) => {
  let updatedHtml = html;

  updatedHtml = updatedHtml.replace(
    /<h2 className="([^"]*)"/g,
    (className) => {
      const classes = className.split(" ");
      if (!classes.includes("font-bold")) {
        classes.push("font-bold");
      }
      return `<h2 className="${classes.join(" ")}"`;
    }
  );

  Object.entries(answers).forEach(([question, answer]) => {
    const placeholder = findPlaceholderByValue(question);
    // Handles calculations
    if (placeholder === "Unused Holiday Days" && typeof(answer) === "string") {
      const calculatedValue = localStorage.getItem("calculatedValue") || "";
      updatedHtml = updatedHtml.replace(
        new RegExp("\\[Holiday Pay\\]", "gi"),
        calculatedValue);
    }
    if (placeholder) {
      const escapedPlaceholder = placeholder.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
      if (typeof answer === "boolean") {
        if (!answer) {
          // handles probation clause
          if (question === "Is the clause of probationary period applicable?") {
            if (answer === false) {
              updatedHtml = updatedHtml.replace(
                /<h2[^>]*>[^<]*PROBATIONARY PERIOD[^<]*<\/h2>\s*<p[^>]*>[\s\S]*?<\/p>/i,
                ""
              );
            }
          }

          updatedHtml = updatedHtml.replace(new RegExp(`.*${escapedPlaceholder}.*`, "gi"), "");
        } else {
          updatedHtml = updatedHtml.replace(
            new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
            "Yes"
          );
        }
      } else if (typeof answer === "string" && answer.trim()) {
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
          answer
        );
      } else {
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${escapedPlaceholder}\\]`, "gi"),
          `[${placeholder}]`
        );
      }
    } else {
      if (question === "Is the sick pay policy applicable?") {
        const sickPayClause = "The Employee may also be entitled to Company sick pay of [Details of Company Sick Pay Policy]";
        if (answer === false) {
          updatedHtml = updatedHtml.replace(sickPayClause, "");
        } else if (answer === true && answers["What's the sick pay policy?"]) {
          updatedHtml = updatedHtml.replace(
            "[Details of Company Sick Pay Policy]",
            answers["What's the sick pay policy?"] as string
          );
        }
      } else if (question === "Is the clause of probationary period applicable?" && answer === false) {
        const probationClauseStart = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">PROBATIONARY PERIOD</h2>');
        const probationClauseEnd = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">JOB TITLE AND DUTIES</h2>');
        if (probationClauseStart !== -1 && probationClauseEnd !== -1) {
          updatedHtml = updatedHtml.slice(0, probationClauseStart) + updatedHtml.slice(probationClauseEnd);
        }
      } else if (question === "Is the termination clause applicable?") {
        const terminationClauseStart = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">TERMINATION</h2>');
        const terminationClauseEnd = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">CONFIDENTIALITY</h2>');
        if (answer === false && terminationClauseStart !== -1 && terminationClauseEnd !== -1) {
          updatedHtml = updatedHtml.slice(0, terminationClauseStart) + updatedHtml.slice(terminationClauseEnd);
        } else if (answer === true && answers["What's the notice period?"]) {
          updatedHtml = updatedHtml.replace(
            /\[Notice Period\]/gi,
            answers["What's the notice period?"] as string
          );
        }
      } else if (question === "Is the previous service applicable?" && answer === false) {
        const prevEmploymentClause = 'or, if applicable, "on [Previous Employment Start Date] with previous continuous service taken into account"';
        updatedHtml = updatedHtml.replace(new RegExp(`\\s*${prevEmploymentClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
      } else if (question === "Does the employee receive overtime payment?" && answer === false) {
        const overtimeYesClause = "{The Employee is entitled to overtime pay at a rate of [Overtime Pay Rate] for authorized overtime work}";
        updatedHtml = updatedHtml.replace(new RegExp(`\\s*${overtimeYesClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
      } else if (question === "Should the employee not receive overtime payment?" && answer === false) {
        const overtimeNoClause = "{The Employee shall not receive additional payment for overtime worked}";
        updatedHtml = updatedHtml.replace(new RegExp(`\\s*${overtimeNoClause.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\s*`, "gi"), "");
      }
    }
  });

  return updatedHtml;
};

const Finish = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [finalAgreement, setFinalAgreement] = useState<React.ReactNode>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: document.body.scrollHeight || window.innerHeight,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: Math.max(document.body.scrollHeight, window.innerHeight),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    setConfetti(true);
    const answers: UserAnswers = location.state?.userAnswers || {};
    const updatedText = processAgreement(documentText, answers);
    setFinalAgreement(parse(updatedText));

    setTimeout(updateDimensions, 100);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [location.state]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleHomeClick = () => {
    navigate("/");
  };
  const storedLevel = sessionStorage.getItem("level") ?? "none";
  return (
    <div
      className={`min-h-screen overflow-hidden flex flex-col font-sans relative transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          : "bg-gradient-to-br from-indigo-50 via-teal-50 to-pink-50"
      }`}
    >
      {confetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.1}
          initialVelocityY={5}
          tweenDuration={6000}
          run={true}
          colors={["#5EEAD4", "#A78BFA", "#F9A8D4", "#FBBF24", "#60A5FA"]}
        />
      )}
      <Navbar 
        level={storedLevel} 
        questionnaire="/Questionnaire" 
        live_generation="/Live_Generation" 
        {...(storedLevel === "/Level-Three-Quiz" ? { calculations: "/Calculations" } : {})}
      />
      <div className="flex justify-center mt-20 mb-12">
        <div
          className={`rounded-xl shadow-xl border p-12 w-4/5 max-w-5xl ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-sm border-gray-700/20"
              : "bg-white/90 backdrop-blur-sm border-teal-100/20"
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-12 tracking-wide text-center border-b-2 pb-4 ${
              isDarkMode ? "text-teal-300 border-teal-600" : "text-teal-700 border-teal-200"
            }`}
          >
            EMPLOYMENT AGREEMENT
          </h1>
          <div className={`${isDarkMode ? "text-teal-200" : "text-teal-900"} leading-relaxed`}>
            {finalAgreement}
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-12 space-x-8">
        <button
          className={`px-8 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 font-semibold ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
          }`}
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className={`px-8 py-3 text-white rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 font-semibold ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
              : "bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500"
          }`}
          onClick={handleHomeClick}
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default Finish;