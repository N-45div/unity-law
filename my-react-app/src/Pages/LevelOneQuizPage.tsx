import { useState } from "react";

const LevelOneQuizPage = () => {
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [selected, setSelected] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintLimit, setHintLimit] = useState<number>(5);
  const [hintToggled, setHintToggled] = useState<boolean>(false);

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
      question: "2. Which of the following features are commonly found in a document builder?",
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
      question: "3. Which file formats are commonly supported for exporting documents?",
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
      question: "6. Why is role-based access control important in a document builder?",
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
      question: "8. Which integrations are most useful in a contract document builder?",
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
      question: "9. What are the advantages of using dynamic content in a document builder?",
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
      question: "10. What are some challenges in implementing a document builder?",
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
      setScore((prevScore) => (prevScore + 10));
    }
    else {
      if (score > 0) {
        setScore((prevScore) => (prevScore - 5));
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
    }
    else {
      setShowHint(false);
    }
    
  }
  
  

  return (
    <div className="h-screen bg-red-400 p-6">
      <div className="flex items-center mb-4 space-x-4">
        <div className="w-full bg-gray-300 h-4 rounded relative">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progressIndex * 10}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-4 text-lg text-black">
        Hints Remaining: {hintLimit}
      </div>
      <div key={currentQuestionIndex} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="font-semibold mb-2">{questions[currentQuestionIndex].question}</h2>
        {questions[currentQuestionIndex].options.map((option, oIndex) => (
          <label key={oIndex} className="block p-2 cursor-pointer">
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              value={oIndex}
              onChange={() => handleSelect(currentQuestionIndex, oIndex)}
              className="mr-2"
              disabled={selected}
            />
            {option}
          </label>
        ))}
        <button
          onClick={() => handleHint()}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Hint
        </button>
        {showHint && (
          <div className="mt-6 p-2 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">
              {questions[currentQuestionIndex].hint}
            </p>
          </div>
        )}
        {selected && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p>Correct answer: {String.fromCharCode(65 + questions[currentQuestionIndex].correct)}</p>
            <p>
              Incorrect answers: {questions[currentQuestionIndex].options.map((_, i) => i).filter
              (i => i !== questions[currentQuestionIndex].correct).map
              (i => String.fromCharCode(65 + i)).join(", ")}
            </p>
          </div>
        )}
        <div className="mt-5 py-3">
          <button
            onClick={() => handleNext()}
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:scale-102 w-full"
          >
            Next
          </button>
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-red-400 bg-opacity-100">
            <div className="bg-white p-6 rounded shadow-lg text-center opacity-100">
              <h2 className="text-xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg">Final Score: {score}</p>
              <button onClick={() => {
                  setShowPopup(false);
                  window.location.href = "/";
                }}
                className="mt-4 p-2 bg-red-500 text-white rounded hover:scale-102">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelOneQuizPage;
