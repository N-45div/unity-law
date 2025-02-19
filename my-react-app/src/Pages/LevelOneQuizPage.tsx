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
        <div className="relative inset-0 flex flex-col h-full p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header section with progress bar and icon */}
          <div className="flex-none">
            <img
              src={iconImage}
              alt="Icon"
              className="absolute -top- left-0 m-0 w-24 h-24 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
            />
            <div className="flex items-center mb-2 space-x-4 mt-16 sm:mt-12 md:mt-8 lg:mt-4">
              <div className="w-full bg-opacity-30 bg-indigo-300 h-2 sm:h-3 md:h-4 rounded-full overflow-hidden border border-indigo-500/30">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-300"
                  style={{ width: `${progressIndex * 10}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-2 text-xs sm:text-sm md:text-base lg:text-lg flex justify-end space-x-4 text-indigo-200 font-semibold">
              <div className="w-fit">Hints: {hintLimit}</div>
              <div className="w-fit">Score: {score}</div>
            </div>
          </div>

          {/* Question section */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto mb-4">
            <div key={currentQuestionIndex} className="flex-1 flex flex-col">
              <h2 
                className="mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl px-2 sm:px-4" 
                style={questionStyle}
              >
                {questions[currentQuestionIndex].question}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 md:mb-6 px-2 sm:px-4">
                {questions[currentQuestionIndex].options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className="flex items-center p-2 sm:p-3 md:p-4 cursor-pointer border-2 border-indigo-500 rounded-lg 
                             bg-gradient-to-r from-indigo-900/80 to-violet-900/80 backdrop-blur-sm
                             hover:from-indigo-800/90 hover:to-violet-800/90 transition-all duration-300
                             text-white shadow-lg shadow-indigo-500/20"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={oIndex}
                      onChange={() => handleSelect(currentQuestionIndex, oIndex)}
                      className="mr-2"
                      disabled={selected}
                    />
                    <span className="text-xs sm:text-sm md:text-base">{`${String.fromCharCode(65 + oIndex)}. ${option}`}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-col space-y-2 px-2 sm:px-4">
                <button
                  onClick={() => handleHint()}
                  className="px-3 sm:px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg
                           hover:from-indigo-400 hover:to-violet-400 transition-all duration-300 shadow-lg shadow-indigo-500/30 
                           cursor-pointer w-20 sm:w-24 md:w-32 text-xs sm:text-sm md:text-base"
                >
                  Show Hint
                </button>

                {showHint && (
                  <div className="p-2 sm:p-3 md:p-4 rounded-lg bg-indigo-900/50 backdrop-blur-sm border border-indigo-500 w-full md:w-max">
                    <p className="text-indigo-200 font-bold text-xs sm:text-sm md:text-base">
                      {questions[currentQuestionIndex].hint}
                    </p>
                  </div>
                )}

                {selected && (
                  <div className="p-2 sm:p-3 md:p-4 md:w-max rounded-lg bg-gradient-to-r from-indigo-900/80 to-violet-900/80 backdrop-blur-sm
                                border-2 border-indigo-500 text-white text-xs sm:text-sm md:text-base">
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
          </div>

          {/* Continue button */}
          <div className="flex-none mt-4 sm:mt-5 md:mt-6 lg:mt-7 mx-auto">
            <button
              onClick={() => handleNext()}
              className="w-auto px-4 sm:px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg
                       hover:from-indigo-400 hover:to-violet-400 transition-all duration-300
                       shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl" style={buttonStyle}>Continue</div>
            </button>
          </div>
        </div>
      </div>

      {/* Completion popup */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-md p-4">
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 p-4 sm:p-6 md:p-8 rounded-lg shadow-2xl border-2 border-indigo-500 w-full max-w-xs sm:max-w-sm md:max-w-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-white">
              Quiz Completed!
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-200">Final Score: {score}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                window.location.href = "/";
              }}
              className="mt-4 md:mt-6 px-3 sm:px-4 md:px-6 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg
                      hover:from-indigo-400 hover:to-violet-400 transition-all duration-300 cursor-pointer text-xs sm:text-sm md:text-base"
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