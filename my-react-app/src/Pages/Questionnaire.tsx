import Navbar from "../components/Navbar";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useHighlightedText } from "../context/HighlightedTextContext";

interface DivWithDropdownProps {
    selectedType: string | null; 
    setSelectedType: (type: string) => void; 
}

const DivWithDropdown: React.FC<DivWithDropdownProps> = ({ selectedType, setSelectedType }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const [selectedItem, setSelectedItem] = useState<string>("Select a question type");
    const [text, setText] = useState<string>("");

    const handleSelect = (item: string) => {
        setSelectedType(item);
        setIsOpen(false); 
    };

    return (
        <div className="flex items-center space-x-20">
            <button className="flex flex-col justify-between h-10 w-10 p-1">
                <span className="block h-1 w-20 bg-black rounded"></span>
                <span className="block h-1 w-20 bg-black rounded"></span>
                <span className="block h-1 w-20 bg-black rounded"></span>
            </button>
            <div className="relative w-200 h-40 bg-lime-300 rounded-lg shadow-md flex flex-col items-center justify-center text-black text-lg font-semibold p-4">      
                <div className="relative w-full flex items-center space-x-2">
                    {selectedType !== "Radio" && (
                        <div className="h-0.5 w-2/5 bg-black absolute left-0"></div>
                    )}
                    {selectedType === "Radio" ? (
                        <div className="flex space-x-20 relative z-10 ml-25">
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="Yes"
                                    checked={text === "Yes"}
                                    onChange={() => setText("Yes")}
                                    className="cursor-pointer"
                                />
                                <span>Yes</span>
                            </label>
                            <label className="flex items-center space-x-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="No"
                                    checked={text === "No"}
                                    onChange={() => setText("No")}
                                    className="cursor-pointer"
                                />
                                <span>No</span>
                            </label>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (selectedType === "Number" && /^[0-9]*$/.test(value)) {
                                    setText(value);
                                } else if (selectedType !== "Number") {
                                    setText(value);
                                }
                            }}
                            className="px-2 py-1 text-sm border-none bg-transparent outline-none w-2/5 relative z-10 top-[-14px] max-w-full overflow-hidden text-ellipsis"
                            placeholder={selectedType === "Number" ? "Enter number" : "Enter text"}
                        />
                    )}
                </div>

                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-black text-sm">{selectedType ?? "Select a question type"}</span>
                    <button
                        className="text-black text-xl transition-transform duration-200 hover:scale-110"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FaChevronDown className={`${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-200`} />
                    </button>
                </div>
                {isOpen && (
                    <div className="absolute top-25 right-3 bg-white text-black rounded-md shadow-md w-40 mt-1 z-10">
                        <ul className="text-sm">
                            {["Text", "Number", "Radio"].map((item) => (
                                <li
                                    key={item}
                                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelect(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        
    );
};

const Questionnaire = () => {
    const [leftActive, setLeftActive] = useState(true); 
    const [rightActive, setRightActive] = useState(false);
    const { firstSelectedType, secondSelectedType, setFirstSelectedType, setSecondSelectedType } = useQuestionType();
    const { highlightedTexts } = useHighlightedText();
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            <Navbar />
            <div className="absolute top-16 right-6 w-80 h-10 bg-lime-300 rounded-lg shadow-md flex items-center justify-center text-black text-sm font-semibold">
                <div className="flex items-center space-x-4">
                    <div
                        className={`flex items-center space-x-2 ${leftActive ? "text-gray-600" : "text-blue-600"}`}
                    >
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
                    <div
                        className={`flex items-center space-x-2 ${rightActive ? "text-gray-600" : "text-blue-600"}`}
                    >
                        <span>Employee</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-20">
                <DivWithDropdown 
                    selectedType={firstSelectedType} 
                    setSelectedType={setFirstSelectedType} 
                />
                <DivWithDropdown 
                    selectedType={secondSelectedType} 
                    setSelectedType={setSecondSelectedType} 
                />
            
            </div>
            <div className="absolute bottom-50 left-10 bg-white p-4 shadow-md rounded-lg">
                <h3 className="text-lg font-semibold">Questions: </h3>
                <ul>
                {highlightedTexts.length > 0 ? (
                    highlightedTexts.map((text, index) => <li key={index}>What would you like to change {text} to?</li>)
                ) : (
                    <li>No questions yet.</li>
                )}
                </ul>
            </div>
        </div>
    );
};

export default Questionnaire;
