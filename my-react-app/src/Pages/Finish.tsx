import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useLocation } from "react-router";
import Confetti from "react-confetti";
import parse, { DOMNode, HTMLReactParserOptions } from "html-react-parser"; // Import specific types
import { documentText } from "../utils/EmploymentAgreement";
import { textTypes, numberTypes, radioTypes } from "../utils/questionTypeUtils";

// Define the type for userAnswers to resolve the 'unknown' issue
interface UserAnswers {
  [key: string]: string | boolean;
}

// Custom function to process HTML and add spacing
const processAgreement = (html: string, answers: UserAnswers) => {
  let updatedHtml = html;

  // Replace placeholders with answers
  Object.entries(answers).forEach(([question, answer]) => {
    const placeholder = Object.keys(textTypes).find(key => textTypes[key] === question) ||
                      Object.keys(numberTypes).find(key => numberTypes[key] === question) ||
                      Object.keys(radioTypes).find(key => radioTypes[key] === question) || "";
    if (placeholder) {
      const probationQuestion = "Is the clause of probationary period applicable?";
      if (question === probationQuestion && answer === false) {
        const probationClauseStart = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">PROBATIONARY PERIOD</h2>');
        const probationClauseEnd = updatedHtml.indexOf('<h2 className="text-2xl font-bold mt-6">JOB TITLE AND DUTIES</h2>');
        if (probationClauseStart !== -1 && probationClauseEnd !== -1) {
          updatedHtml = updatedHtml.slice(0, probationClauseStart) + updatedHtml.slice(probationClauseEnd);
        }
      } else {
        const answerValue = typeof answer === "boolean" ? answer.toString() : answer;
        updatedHtml = updatedHtml.replace(
          new RegExp(`\\[${placeholder.replace(/\s+/g, " ").trim()}\\]`, "gi"),
          answerValue || `[${placeholder}]`
        );
      }
    }
  });

  // Parse HTML and add spacing between clauses
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'tag' && domNode.name === 'h2' && domNode.attribs?.class?.includes('text-2xl font-bold mt-6')) {
        // Collect content after h2 (e.g., next <p> or text)
        let content = `<h2 ${domNode.attribs ? Object.entries(domNode.attribs).map(([k, v]) => `${k}="${v}"`).join(' ') : ''}>`;
        if (domNode.children && domNode.children.length > 0) {
          content += domNode.children.map(child => {
            if (child.type === 'text') {
              return child.data || '';
            } else if (child.type === 'tag') {
              // Handle nested tags (e.g., <span>)
              return `<${child.name} ${child.attribs ? Object.entries(child.attribs).map(([k, v]) => `${k}="${v}"`).join(' ') : ''}>${
                child.children ? child.children.map(c => {
                  if (c.type === 'text') return c.data || '';
                  return ''; // Ignore non-text children for simplicity
                }).join('') : ''
              }</${child.name}>`;
            }
            return '';
          }).join('');
        }
        content += '</h2>';

        // Get the next sibling (e.g., <p> tag)
        const nextSibling = domNode.next;
        if (nextSibling && nextSibling.type === 'tag' && nextSibling.name === 'p') {
          content += nextSibling.children.map(child => child.type === 'text' ? child.data || '' : '').join('');
        }

        return <div className="mt-6">{parse(content)}</div>;
      }
      return domNode;
    }
  };

  const parsed = parse(updatedHtml, options);
  return parsed;
};

const Finish = () => {
  const [confetti, setConfetti] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const [finalAgreement, setFinalAgreement] = useState<React.ReactNode>(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: document.body.scrollHeight || window.innerHeight
  });

  useEffect(() => {
    // Function to update dimensions
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: Math.max(document.body.scrollHeight, window.innerHeight)
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Add event listener for resize
    window.addEventListener('resize', updateDimensions);

    // Set confetti to true and process agreement
    setConfetti(true);
    const answers: UserAnswers = location.state?.userAnswers || {};
    const processedAgreement = processAgreement(documentText, answers);
    setFinalAgreement(processedAgreement);

    // Update dimensions again after content loads
    setTimeout(updateDimensions, 100);

    // Clean up event listener
    return () => window.removeEventListener('resize', updateDimensions);
  }, [location.state]);

  const handleBackClick = () => {
    // Navigate back to the previous page or default to Document tab
    navigation(-1); // Go back in history
  };

  const handleHomeClick = () => {
    navigation("/");
  };

  return (
    <div className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
      {confetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={true}
          numberOfPieces={150}
          gravity={0.15}
          initialVelocityY={3}
          tweenDuration={5000}
          run={true}
        />
      )}
      <Navbar />
      <div className="flex justify-center mt-16 mb-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-10 w-4/5">
          <h1 className="text-blue-700 text-4xl font-bold mb-10 tracking-wide text-center border-b-2 border-blue-200 pb-4">
            EMPLOYMENT AGREEMENT
          </h1>
          <div className="text-blue-700 leading-relaxed">{finalAgreement}</div>
        </div>
      </div>
      <div className="flex justify-center mb-8 space-x-6">
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:scale-105 transition-all duration-300 font-semibold shadow-md"
          onClick={handleBackClick}
        >
          Back
        </button>
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:scale-105 transition-all duration-300 font-semibold shadow-md"
          onClick={handleHomeClick}
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

export default Finish;



// original 2