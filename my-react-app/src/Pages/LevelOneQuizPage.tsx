import { useState } from "react";

const LevelOneQuizPage = () => {
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [score, setScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const questions = [
    {
      question: "1. What is the primary purpose of a document builder?",
      options: [
        "To manually type documents faster",
        "To automate document creation and customization",
        "To store documents permanently",
        "To translate documents into different languages",
      ],
      correct: [1],
    },
    {
      question: "2. Which of the following features are commonly found in a document builder?",
      options: [
        "Real-time collaboration",
        "Video editing tools",
        "Template-based document creation",
        "Handwritten document scanning",
      ],
      correct: [0, 2],
    },
    {
      question: "3. Which file formats are commonly supported for exporting documents?",
      options: ["PDF", "DOCX", "MP4", "JPG"],
      correct: [0, 1],
    },
    {
      question: "4. What is the key advantage of using document templates?",
      options: [
        "They ensure consistency and save time",
        "They make documents harder to customize",
        "They require starting from scratch each time",
        "They increase the size of the document",
      ],
      correct: [0],
    },
    {
      question: "5. How does version control help in document building?",
      options: [
        "It allows users to track and revert to previous versions",
        "It prevents any modifications after a document is created",
        "It helps users collaborate by tracking changes",
        "It automatically deletes old versions",
      ],
      correct: [0, 2],
    },
    {
      question: "6. Why is role-based access control important in a document builder?",
      options: [
        "It allows only one user to edit at a time",
        "It ensures only authorized users can view or edit specific documents",
        "It prevents documents from being saved",
        "It removes the need for login credentials",
      ],
      correct: [1],
    },
    {
      question: "7. What automation features can a document builder have?",
      options: [
        "Auto-fill fields based on user input",
        "Conditional content based on form responses",
        "Manual document formatting only",
        "Static document structure",
      ],
      correct: [0, 1],
    },
    {
      question: "8. Which integrations are most useful in a contract document builder?",
      options: [
        "E-signature platforms (e.g., DocuSign)",
        "CRM systems (e.g., Salesforce)",
        "Social media sharing tools",
        "Cloud storage services (e.g., Google Drive)",
      ],
      correct: [0, 1, 3],
    },
    {
      question: "9. What are the advantages of using dynamic content in a document builder?",
      options: [
        "It allows content to change based on external data",
        "It makes documents harder to edit",
        "It requires manual updates each time",
        "It only works for printed documents",
      ],
      correct: [0],
    },
    {
      question: "10. What are some challenges in implementing a document builder?",
      options: [
        "Ensuring data security and privacy",
        "Making the document creation process more complex",
        "Integrating with existing business tools",
        "Removing automation features to increase manual control",
      ],
      correct: [0, 2],
    },
  ];

  const handleSelect = (question: number, answer: number) => {
    setAnswers((prevAnswers) => {
      const selectedAnswers = prevAnswers[question] || [];
      return {
        ...prevAnswers,
        [question]: selectedAnswers.includes(answer)
          ? selectedAnswers.filter((a) => a !== answer)
          : [...selectedAnswers, answer],
      };
    });
  };

  const handleSubmit = (questionIndex: number) => {
    const selected = answers[questionIndex] || [];
    const correct = questions[questionIndex].correct;
    const selectedCorrect = selected.filter((answer) => correct.includes(answer));
    const partialMark = (selectedCorrect.length / correct.length) * 10;
    setScore((prevScore) => (prevScore ?? 0) + partialMark);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("Quiz finished!");
    }
  };
  

  return (
    <div className="h-screen bg-red-400 p-6">
      <div className="flex items-center mb-4 space-x-4">
        <div className="w-full bg-gray-300 h-4 rounded relative">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${score ?? 0}%` }}
          ></div>
        </div>
        <span className="text-lg font-semibold min-w-[50px] text-white">
          {Math.round(score ?? 0)}%
        </span>
      </div>
      <div key={currentQuestionIndex} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="font-semibold mb-2">{questions[currentQuestionIndex].question}</h2>
        {questions[currentQuestionIndex].options.map((option, oIndex) => (
          <label key={oIndex} className="block p-2 cursor-pointer">
            <input
              type="checkbox"
              name={`question-${currentQuestionIndex}`}
              value={oIndex}
              checked={answers[currentQuestionIndex]?.includes(oIndex) || false}
              onChange={() => handleSelect(currentQuestionIndex, oIndex)}
              className="mr-2"
            />
            {option}
          </label>
        ))}
        <div className="mt-5 py-3">
          <button
            onClick={() => handleSubmit(currentQuestionIndex)}
            className="mt-4 p-2 bg-blue-500 text-white rounded hover:scale-102 w-full"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelOneQuizPage;
