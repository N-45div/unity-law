import Navbar from "../components/Navbar";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useHighlightedText } from "../context/HighlightedTextContext";
import { determineQuestionType } from "../utils/questionTypeUtils";

interface DivWithDropdownProps {
    selectedType: string | null; 
    setSelectedType: (type: string) => void; 
    textValue?: string; 
}

const DivWithDropdown: React.FC<DivWithDropdownProps> = ({ selectedType, setSelectedType, textValue = "" }) => {
    const [questionText, setQuestionText] = useState("");

    useEffect(() => {
        const { value } = determineQuestionType(textValue); 
        setQuestionText(value); 
        const { type } = determineQuestionType(textValue);
        setSelectedType(type);
    }, [textValue, setSelectedType]);

    return (
        <div className="flex items-center space-x-20">
            <button className="flex flex-col justify-between h-10 w-10 p-1">
                <span className="block h-1 w-20 bg-black rounded"></span>
                <span className="block h-1 w-20 bg-black rounded"></span>
                <span className="block h-1 w-20 bg-black rounded"></span>
            </button>
            <div className="relative w-200 h-40 bg-lime-300 rounded-lg shadow-md flex flex-col items-center justify-center text-black text-lg font-semibold p-4">      
                <div className="relative w-full flex items-center space-x-2">
                    <div className="h-0.5 w-2/5 bg-black absolute left-0"></div>
                    <span className="px-2 py-1 text-sm bg-transparent w-2/5 relative z-10 top-[-14px] max-w-full overflow-hidden text-ellipsis">
                        {questionText || "No text selected"}
                    </span>
                </div>

                <div className="absolute top-1/2 right-10 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-black text-sm">{selectedType ?? "Unknown Type"}</span>
                </div>
            </div>
        </div>
    );
};


const Questionnaire = () => {
    const [leftActive, setLeftActive] = useState(true);
    const [rightActive, setRightActive] = useState(false);
    const { firstSelectedType, secondSelectedType, setFirstSelectedType, setSecondSelectedType } = useQuestionType();
    const { highlightedTexts } = useHighlightedText();

    // Take the first two highlighted texts (if available)
    const firstTextValue = highlightedTexts[0] || ""; 
    const secondTextValue = highlightedTexts[1] || "";

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            <Navbar />
            <div className="absolute top-16 right-6 w-80 h-10 bg-lime-300 rounded-lg shadow-md flex items-center justify-center text-black text-sm font-semibold">
                <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${leftActive ? "text-gray-600" : "text-blue-600"}`}>
                        <span>Employer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => { setLeftActive(true); setRightActive(false); }}>
                            <FaChevronLeft className="text-xl hover:scale-110" />
                        </button>
                        <button onClick={() => { setRightActive(true); setLeftActive(false); }}>
                            <FaChevronRight className="text-xl hover:scale-110" />
                        </button>
                    </div>
                    <div className={`flex items-center space-x-2 ${rightActive ? "text-gray-600" : "text-blue-600"}`}>
                        <span>Employee</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-20">
                <DivWithDropdown 
                    selectedType={firstSelectedType} 
                    setSelectedType={setFirstSelectedType}
                    textValue={firstTextValue}  
                />
                <DivWithDropdown 
                    selectedType={secondSelectedType} 
                    setSelectedType={setSecondSelectedType} 
                    textValue={secondTextValue} 
                />
            </div>
             
            {/* <div className="absolute bottom-50 left-10 bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-semibold">Questions: </h3>
                <ul>
                    {highlightedTexts.length > 0 ? (
                        highlightedTexts.map((text, index) => (
                            <li key={index}>What would you like to change {text} to?</li>
                        ))
                    ) : (
                        <li>No questions yet.</li>
                    )}
                </ul>
            </div> */}
        </div>
    );
};


export default Questionnaire;
