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
        "6. How can you ensure a contract automatically selects the correct jurisdiction based on the client’s location?",
      options: [
        "Ask the user to manually choose the jurisdiction each time",
        "Use a variable that pulls the jurisdiction based on the client’s location data",
        " Include all possible jurisdictions and let the user delete the irrelevant ones",
        "Hardcode a default jurisdiction for all contracts",
      ],
      correct: 1,
      hint: "Automation should adapt based on client-specific details to reduce manual edits",
    },
    {
      question: "7. What is the best way to dynamically insert different payment terms based on contract type?",
      options: [
        "Use a conditional rule that selects the relevant payment terms automatically",
        " Manually type the payment terms after generating the document",
        "Include all payment terms in the contract and delete the unnecessary ones",
        "Leave a blank space and ask the user to fill in the payment terms later",
      ],
      correct: 0,
      hint: " Conditional logic helps automate document variations based on contract type",
    },
    {
      question:
        "8.  What is the best way to generate a report of all contracts expiring within the next 30 days?",
      options: [
        " Set up a scheduled workflow that filters and extracts contracts expiring soon",
        "Open each contract manually and check the expiration date",
        "Ask employees to maintain a spreadsheet of contract expiration dates",
        "Review contracts only when a renewal request comes in",
      ],
      correct: 0,
      hint: "Automated workflows help monitor and manage contract deadlines efficiently.",
    },
    {
      question:
        "9. How can you automatically notify stakeholders when a contract reaches a critical stage?",
      options: [
        "Set up an automated workflow to send notifications based on contract milestones",
        "Assign someone to manually send emails when updates are needed",
        "Check contract statuses periodically and inform stakeholders if necessary",
        " Rely on stakeholders to follow up on their own without automated reminders",
      ],
      correct: 0,
      hint: "Automated notifications keep stakeholders informed without manual intervention",
    },
    {
      question:
        "10. How can you automatically pre-fill customer details in a contract?",
      options: [
        " Integrate the contract automation system with a CRM to pull customer data",
        " Manually type the customer details for each new contract",
        "Copy and paste customer details from previous contracts",
        "Leave the fields blank and ask the user to fill them in before sending",
      ],
      correct: 0,
      hint: "Integrating external systems eliminates manual data entry and improves accuracy",
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
