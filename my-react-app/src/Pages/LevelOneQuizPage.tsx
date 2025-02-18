import { useState, useEffect } from "react";
import backgroundImage from "../assets/quizBackground.png";
import iconImage from "../assets/quizIcon.png";
import "@fontsource/orbitron/900.css";
import "@fontsource/pixelify-sans/400.css";

const LevelOneQuizPage = () => {
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [selected, setSelected] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintLimit, setHintLimit] = useState<number>(5);
  const [hintToggled, setHintToggled] = useState<boolean>(false);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selected]);

  const questionStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 900,
    color: "#E2E8F0",
    textShadow:
      "0 0 10px rgba(129, 140, 248, 0.5), 0 0 20px rgba(129, 140, 248, 0.3)",
    textTransform: "uppercase" as "uppercase",
    textAlign: "center" as "center",
    padding: "10px",
  };

  const buttonStyle = {
    fontFamily: "'Pixelify Sans', sans-serif",
    fontWeight: 400,
    color: "#F0F4FF",
    textTransform: "uppercase" as "uppercase",
    textAlign: "center" as "center",
    textShadow: "0 0 5px rgba(129, 140, 248, 0.5)",
  };

  const questions = [
    {
      question: "1. What is the primary purpose of a document builder?",
      options: [
        "To manually type documents faster",
        "To automate document creation and customization",
        "To store documents permanently",
        "To translate documents into different languages",
      ],
      correct: 1,
      hint: "lorem ipsum",
    },
    {
      question:
        "2. Which of the following features are commonly found in a document builder?",
      options: [
        "Real-time collaboration",
        "Video editing tools",
        "Template-based document creation",
        "Handwritten document scanning",
      ],
      correct: 0,
      hint: "lorem ipsum",
    },
    {
      question:
        "3. Which file formats are commonly supported for exporting documents?",
      options: ["PDF", "DOCX", "MP4", "JPG"],
      correct: 1,
      hint: "lorem ipsum",
    },
    {
      question: "4. What is the key advantage of using document templates?",
      options: [
        "They ensure consistency and save time",
        "They make documents harder to customize",
        "They require starting from scratch each time",
        "They increase the size of the document",
      ],
      correct: 0,
      hint: "lorem ipsum",
    },
    {
      question: "5. How does version control help in document building?",
      options: [
        "It allows users to track and revert to previous versions",
        "It prevents any modifications after a document is created",
        "It helps users collaborate by tracking changes",
        "It automatically deletes old versions",
      ],
      correct: 2,
      hint: "lorem ipsum",
    },
    {
      question:
        "6. Why is role-based access control important in a document builder?",
      options: [
        "It allows only one user to edit at a time",
        "It ensures only authorized users can view or edit specific documents",
        "It prevents documents from being saved",
        "It removes the need for login credentials",
      ],
      correct: 1,
      hint: "lorem ipsum",
    },
    {
      question: "7. What automation features can a document builder have?",
      options: [
        "Auto-fill fields based on user input",
        "Conditional content based on form responses",
        "Manual document formatting only",
        "Static document structure",
      ],
      correct: 0,
      hint: "lorem ipsum",
    },
    {
      question:
        "8. Which integrations are most useful in a contract document builder?",
      options: [
        "E-signature platforms (e.g., DocuSign)",
        "CRM systems (e.g., Salesforce)",
        "Social media sharing tools",
        "Cloud storage services (e.g., Google Drive)",
      ],
      correct: 0,
      hint: "lorem ipsum",
    },
    {
      question:
        "9. What are the advantages of using dynamic content in a document builder?",
      options: [
        "It allows content to change based on external data",
        "It makes documents harder to edit",
        "It requires manual updates each time",
        "It only works for printed documents",
      ],
      correct: 0,
      hint: "lorem ipsum",
    },
    {
      question:
        "10. What are some challenges in implementing a document builder?",
      options: [
        "Ensuring data security and privacy",
        "Making the document creation process more complex",
        "Integrating with existing business tools",
        "Removing automation features to increase manual control",
      ],
      correct: 2,
      hint: "lorem ipsum",
    },
  ];

  const handleSelect = (question: number, answer: number) => {
    setSelected(true);
    const correct = questions[question].correct;
    if (correct == answer) {
      setScore((prevScore) => prevScore + 10);
    } else {
      if (score > 0) {
        setScore((prevScore) => prevScore - 5);
      }
    }
  };

  const handleNext = () => {
    if (selected) {
      setSelected(false);
      setShowHint(false);
      setHintToggled(false);
      setProgressIndex((prevIndex) => prevIndex + 1);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setShowPopup(true);
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const handleHint = () => {
    if (!showHint && hintLimit > 0) {
      if (!hintToggled) {
        setHintLimit((prevLimit) => prevLimit - 1);
        setHintToggled(true);
      }
      setShowHint(true);
    } else {
      setShowHint(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "#1E1B4B",
        }}
      >
        <div className="absolute inset-0 flex flex-col p-3 md:p-6">
          {/* Progress bar and icon */}
          <div className="flex-none">
            <img
              src={iconImage}
              alt="Icon"
              className="absolute -top-2 left-0 m-0 w-32 h-32 md:w-48 md:h-48 lg:w-52 lg:h-52"
            />
            <div className="flex items-center mb-4 space-x-4 mt-16 md:mt-0">
              <div className="w-full bg-opacity-30 bg-indigo-300 h-3 md:h-4 rounded-full overflow-hidden border border-indigo-500/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-300"
                  style={{ width: `${progressIndex * 10}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-4 text-sm md:text-lg flex justify-end space-x-4 md:space-x-6 text-indigo-200 font-semibold">
              <div className="w-fit">Hints: {hintLimit}</div>
              <div className="w-fit">Score: {score}</div>
            </div>
          </div>

          {/* Question section */}
          <div className="flex-1 flex flex-col max-h-full md:max-h-[calc(100vh-280px)] overflow-y-aut md:mt-10">
            <div key={currentQuestionIndex} className="flex-1 flex flex-col">
              <h2 className="mb-4 md:mb-8 text-xl md:text-3xl lg:text-4xl" style={questionStyle}>
                {questions[currentQuestionIndex].question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6">
                {questions[currentQuestionIndex].options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className="flex items-center p-3 md:p-4 cursor-pointer border-2 border-indigo-500 rounded-lg 
                             bg-gradient-to-r from-indigo-900/80 to-violet-900/80 backdrop-blur-sm
                             hover:from-indigo-800/90 hover:to-violet-800/90 transition-all duration-300
                             text-white shadow-lg shadow-indigo-500/20 text-sm md:text-base"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={oIndex}
                      onChange={() => handleSelect(currentQuestionIndex, oIndex)}
                      className="mr-2"
                      disabled={selected}
                    />
                    <span>{`${String.fromCharCode(65 + oIndex)}. ${option}`}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => handleHint()}
                className="mt-2 md:mt-4 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg
                         hover:from-indigo-400 hover:to-violet-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 cursor-pointer 
                         w-24 md:w-32 lg:w-40 text-sm md:text-base"
              >
                Show Hint
              </button>

              {showHint && (
                <div className="mt-2 md:mt-4 p-3 md:p-4 rounded-lg bg-indigo-900/50 backdrop-blur-sm border border-indigo-500 w-full md:w-max">
                  <p className="text-indigo-200 font-bold text-sm md:text-base">
                    {questions[currentQuestionIndex].hint}
                  </p>
                </div>
              )}

              {selected && (
                <div className="mt-2 w-max md:mt-4 p-3 md:p-4 rounded-lg bg-gradient-to-r from-indigo-900/80 to-violet-900/80 backdrop-blur-sm
                              border-2 border-indigo-500 text-white text-sm md:text-base">
                  <p>
                    Correct answer:{" "}
                    {String.fromCharCode(65 + questions[currentQuestionIndex].correct)}
                  </p>
                  <p>
                    Incorrect answers:{" "}
                    {questions[currentQuestionIndex].options
                      .map((_, i) => i)
                      .filter((i) => i !== questions[currentQuestionIndex].correct)
                      .map((i) => String.fromCharCode(65 + i))
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Continue button */}
          <div className="flex-none h-20 md:h-30 flex items-center justify-center mt-4">
            <button
              onClick={() => handleNext()}
              className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg
                       hover:from-indigo-400 hover:to-violet-400 transition-all duration-300
                       shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <div className="text-xl md:text-2xl lg:text-3xl" style={buttonStyle}>Continue</div>
            </button>
          </div>
        </div>
      </div>

      {/* Completion popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md p-4">
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 p-6 md:p-8 rounded-lg shadow-2xl border-2 border-indigo-500 w-full max-w-sm md:max-w-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">
              Quiz Completed!
            </h2>
            <p className="text-lg md:text-xl text-indigo-200">Final Score: {score}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                window.location.href = "/";
              }}
              className="mt-4 md:mt-6 px-4 md:px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg
                      hover:from-indigo-400 hover:to-violet-400 transition-all duration-300 cursor-pointer text-sm md:text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelOneQuizPage;
