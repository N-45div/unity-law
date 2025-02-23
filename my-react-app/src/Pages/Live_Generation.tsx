import { useNavigate } from "react-router";
import { useQuestionType } from "../context/QuestionTypeContext";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Live_Generation = () => {
    const { firstSelectedType } = useQuestionType();
    const navigation = useNavigate();
    const [text, setText] = useState<string>("");
    const handleButtonClick = () => {
        navigation("/Live_Generation_2");
    };
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            <Navbar />
            <div className="absolute top-32 left-10 w-100 h-30 bg-lime-300 rounded-lg shadow-md flex items-center justify-center text-black text-sm font-semibold">
                <div className="flex items-center space-x-4">
                    <span>1. What's the name of the employee?</span>
                </div>
            </div>
            <div className="absolute top-75 left-10 w-250 flex items-center space-x-2">
                {firstSelectedType !== "Radio" && (
                    <div className="h-0.5 w-2/5 bg-black absolute left-0"></div>
                )}
                {firstSelectedType === "Radio" ? (
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
                            if (firstSelectedType === "Number" && /^[0-9]*$/.test(value)) {
                                setText(value);
                            } else if (firstSelectedType !== "Number") {
                                setText(value);
                            }
                        }}
                        className="px-2 py-1 text-sm border-none bg-transparent outline-none w-2/5 relative z-10 top-[-14px] max-w-full overflow-hidden text-ellipsis"
                        placeholder={firstSelectedType === "Number" ? "Enter number" : "Enter text"}
                    />
                )}
            </div>
            <div className="flex justify-end mt-16 mr-20">
                <div className="bg-white rounded-lg shadow-sm border border-black-100 p-8 w-1/2">
                    <h1 className="text-blue-600 text-3xl font-bold mb-8 tracking-tight">
                        EMPLOYMENT AGREEMENT
                    </h1>
                    <div className="text-blue-600 leading-relaxed">
                        <h2 className="text-2xl font-bold">PARTIES</h2>
                        <p>
                            <strong>Employer:</strong> [Employer Name], a company incorporated
                            and registered in [Registered Address], United Kingdom
                            ("Company").
                        </p>
                        <p>
                            <strong>Employee:</strong> [Employee Name], residing at [Employee
                            Address] ("Employee").
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end absolute bottom-20 right-20">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
                    onClick={handleButtonClick}
                >
                    Next Page
                </button>
            </div>
            
        </div>
    );
}
export default Live_Generation;