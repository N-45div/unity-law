import { useState } from "react";
import backgroundImage from '../assets/quizBackground.png';
import iconImage from '../assets/quizIcon.png';
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

  const questionStyle = {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: 900,
    fontSize: "45px",
    color: "white",
    textTransform: "uppercase" as "uppercase",
    textAlign: "center" as "center",
    padding: "10px",
  };
  const buttonStyle = {
    fontFamily: "'Pixelify Sans', sans-serif",
    fontWeight: 400,
    fontSize: "35px",
    color: "black",
    textTransform: "uppercase" as "uppercase",
    textAlign: "center" as "center",
  };

  const questions = [
    {
      question:
        '1.  What is the best way to automate a placeholder like "Company Name" in an advanced CLM tool like Contract Coder?',
      options: [
        " Put curly braces around the placeholders",
        "Use square braces around the placeholder",
        " Identify a placeholder and click on the placeholder button to automate it",
        "Write the company name in all caps for emphasis",
      ],
      correct: 2,
      hint: "Remember what you learned in the previous video about automating placeholders",
    },
    {
      question:
        "2.  How can you ensure automated documents retrieve the latest data from an external system (e.g., CRM, ERP)?",
      options: [
        " Manually check and update data in the document before finalizing",
        " Integrate API calls or database queries to pull real-time data dynamically",
        " Export data from external systems and copy-paste it into the document",
        "Set a reminder to periodically refresh data by re-importing it manually",
      ],
      correct: 1,
      hint: " Consider how integration with other tools can improve efficiency and accuracy",
    },
    {
      question:
        "3.  How do you dynamically insert repeating sections (e.g., multiple signatories or payment terms)?",
      options: [
        "Copy-paste the required section multiple times as needed",
        " Use a loop to generate multiple entries based on a dataset",
        "Leave placeholders and ask users to fill them in manually",
        " Create separate templates for different numbers of repeating sections",
      ],
      correct: 1,
      hint: "Think about how loops can generate structured data efficiently",
    },
    {
      question: "4.  Why use automation in legal documents?",
      options: [
        " To reduce human error",
        "To save time on repetitive tasks",
        " Both A and B",
        "To increase document length for billing purposes",
      ],
      correct: 2,
      hint: "Think about the main benefits that automation brings to legal workflows",
    },
    {
      question:
        "5.  How can you ensure tasks are assigned to the right team members?",
      options: [
        "Manually assign tasks based on availability",
        "Use role-based assignment rules to automatically assign tasks",
        "Ask team members to pick up tasks themselves",
        " Assign all tasks to a single team member for efficiency",
      ],
      correct: 1,
      hint: "Consider a method that reduces manual effort and ensures tasks are assigned based on predefined criteria",
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
    <div className="relative h-screen">
      <div
        className="relative inset-0 p-6 bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "100% 100%",
        }}
      >
        <img
          src={iconImage}
          alt="Icon"
          className="absolute top-2 left-0 m-0"
          style={{ width: "200px", height: "200px" }}
        />
        <div className="flex items-center mb-4 space-x-4">
          <div className="w-full bg-gray-300 h-4 rounded relative">
            {/* <div
              className="bg-green-500 h-4 rounded"
              style={{ width: `${progressIndex * 10}%` }}
            ></div> */}
            <div
              className="bg-green-500 h-4 rounded transition-width duration-500 ease-in-out"
              style={{ width: `${progressIndex * 10}%` }}
            ></div>
          </div>
        </div>
        <div className="mb-15 text-lg text-white flex justify-end space-x-6">
          <div className="w-fit">Hints Remaining: {hintLimit}</div>
          <div className="w-fit">Total Score: {score}</div>
        </div>

        <div key={currentQuestionIndex}>
          <h2 className="mb-10" style={questionStyle}>
            {questions[currentQuestionIndex].question}
          </h2>
          <div className="grid grid-cols-2 gap-10 h-40">
            {questions[currentQuestionIndex].options.map((option, oIndex) => (
              <label
                key={oIndex}
                className="flex item-center p-4 cursor-pointer text-black border border-gray-300 rounded-lg bg-gradient-to-r from-yellow-200 to-pink-300"
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
            className="mt-10 p-2 bg-blue-500 text-black rounded hover:scale-102 bg-gradient-to-r from-yellow-500 to-[#40E0D0]"
          >
            Show Hint
          </button>
          {showHint && (
            <div className="mt-6 p-1 rounded">
              <p className="text-sm text-white text-bold font-bold">
                {questions[currentQuestionIndex].hint}
              </p>
            </div>
          )}
          {selected && (
            <div className="mt-10 p-2 bg-gray-100 rounded bg-gradient-to-r from-yellow-200 to-pink-300">
              <p>
                Correct answer:{" "}
                {String.fromCharCode(
                  65 + questions[currentQuestionIndex].correct
                )}
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
          <div className="mt-5 py-3">
            <button
              onClick={() => handleNext()}
              className="mt-4 p-0.5 bg-blue-500 text-black rounded hover:scale-102 w-90 bg-gradient-to-r from-yellow-500 to-[#40E0D0] block mx-auto"
            >
              <div style={buttonStyle}>Continue</div>
            </button>
          </div>
          {showPopup && (
            <div
              className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-100"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="bg-white p-6 rounded shadow-lg text-center opacity-100">
                <h2 className="text-xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-lg">Final Score: {score}</p>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    window.location.href = "/";
                  }}
                  className="mt-4 p-2 bg-red-500 text-white rounded hover:scale-102"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LevelOneQuizPage;
