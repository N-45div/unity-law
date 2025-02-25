import React, { useState, useEffect } from "react";
import lawyaltechLogo from "../assets/lawyaltech_logo.png";
import klaraImg from "../assets/klara.png";

const steps = [
  {
    heading: "What is Contract Lifecycle Management?",
    content: [
      `Contract lifecycle management (CLM) is the process of managing a contract from initiation through execution, performance, and renewal or expiration.`,
      `CLM tools are software solutions that automate and streamline various stages of this process to enhance efficiency and compliance.`,
    ],
    footerImg: lawyaltechLogo,
  },
  {
    content: [
      `Embark on the journey of Ana Smith, a Legal Intern at the prestigious Ron & Taylor's law firm in the heart of London.`,
      `As Ana, you're currently immersed in legal research and handling elementary legal tasks, but your true passion lies in legal technology.`,
    ],
    footerImg: lawyaltechLogo,
  },
  {
    content: [
      `Meet Klara, the head of the IT department at Ron & Taylor’s.`,
      `She will be assisting you with your training on how to configure and navigate through CLM tools.`,
    ],
    klara: klaraImg,
    footerImg: lawyaltechLogo,
  },
  {
    content: [
      `To begin, you should get familiar with some of the Legal Tech Jargons commonly used in CLM tools:`,
    ],
    list: [
      {
        term: "Document Automation",
        definition:
          "The use of software to create legal documents by automatically filling in details specific to each case.",
      },
      {
        term: "Negotiation",
        definition:
          "The process within CLM tools that facilitates back-and-forth communication and revisions to reach a mutual agreement on contract terms.",
      },
      {
        term: "Placeholders",
        definition:
          "Designated spaces in a document template where specific data can be automatically inserted by a CLM system.",
      },
      {
        term: "Conditions",
        definition:
          "Predefined rules or criteria that trigger specific actions or changes in a contract document within a CLM system.",
      },
    ],
    footerImg: lawyaltechLogo,
  },
];

const ContentComponent: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [paragraphIndex, setParagraphIndex] = useState<number>(0);

  useEffect(() => {
    setDisplayText([]); // Reset text when step changes
    setParagraphIndex(0);
  
    const paragraphs = [...steps[count].content]; // Clone content array
  
    // If there's a list, add its terms and definitions as separate paragraphs
    if (steps[count].list) {
      steps[count].list.forEach((item) => {
        paragraphs.push(`${item.term}: ${item.definition}`);
      });
    }
  
    let currentPara = 0; // Track which paragraph is being typed
  
    const typeNextParagraph = () => {
      if (currentPara < paragraphs.length) {
        let i = 0;
        let tempText = "";
  
        const interval = setInterval(() => {
          if (i < paragraphs[currentPara].length) {
            tempText += paragraphs[currentPara][i];
            setDisplayText((prev) => {
              const newText = [...prev];
              newText[currentPara] = tempText;
              return newText;
            });
            i++;
          } else {
            clearInterval(interval);
            currentPara++; // Move to the next paragraph
            if (currentPara < paragraphs.length) {
              setTimeout(typeNextParagraph, 500); // Delay before typing next paragraph
            }
          }
        }, 30); // Typing speed
  
        return interval;
      }
    };
  
    const intervalId = typeNextParagraph(); // Start typing effect
  
    return () => {
      clearInterval(intervalId); // Cleanup when component re-renders
    };
  }, [count]);
  

  return (
    <div className={steps[count].klara ? "px-10 py-5" : "p-20"}>
      {steps[count].heading && (
        <h3 className="font-semibold mb-4 uppercase font-mono text-4xl text-center pb-6">
          {steps[count].heading}
        </h3>
      )}
      <div className="flex flex-row items-center">
        {/* Render Klara image if available */}
        {steps[count].klara && <img src={steps[count].klara} alt="klara" className="mr-4" />}
        <span>
          {/* Render each paragraph with typing effect */}
          {displayText.map((paragraph, idx) => (
            <p key={idx} className="font-mono text-lg mb-4">
              {paragraph}
            </p>
          ))}
        </span>
      </div>

      {/* Render list if available */}
      {/* {steps[count].list && (
        <ul className="list-disc ml-8">
          {steps[count].list.map((item, idx) => (
            <li key={idx} className="font-mono text-lg mb-2">
              <strong>{item.term}:</strong> {item.definition}
            </li>
          ))}
        </ul>
      )} */}

      {/* Navigation */}
      <div className={`flex justify-between ${steps[count].klara ? "" : "mt-12"}`}>
        
        {/* Render footer image if available */}
        {steps[count].footerImg && (
          <div className="w-54 h-26">
            <img src={steps[count].footerImg} alt="Lawyaltech Logo" />
          </div>
        )}
        {count < steps.length - 1 && (
          <button
            className="mt-4 px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300"
            onClick={() => setCount(count + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentComponent;
