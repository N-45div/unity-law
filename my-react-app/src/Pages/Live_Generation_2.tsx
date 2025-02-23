import { useState } from "react";
import { useQuestionType } from "../context/QuestionTypeContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

const Live_Generation = () => {
    const { secondSelectedType } = useQuestionType();
    const navigation = useNavigate();
    const [text, setText] = useState<string>("");
    const handleFinishClick = () => {
        navigation("/Finish");
    };
    const handleBackClick = () => {
        navigation("/Live_Generation");
    }
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            <Navbar />
            <div className="absolute top-32 left-10 w-100 h-30 bg-lime-300 rounded-lg shadow-md flex items-center justify-center text-black text-sm font-semibold">
                <div className="flex items-center space-x-4">
                    <span>2. Is the clause of Probationary Period included?</span>
                </div>
            </div>
            <div className="absolute top-75 left-10 w-250 flex items-center space-x-2">
                {secondSelectedType !== "Radio" && (
                    <div className="h-0.5 w-2/5 bg-black absolute left-0"></div>
                )}
                {secondSelectedType === "Radio" ? (
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
                        type={secondSelectedType === "Number" ? "number" : "text"}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="px-2 py-1 text-sm border-none bg-transparent outline-none w-2/5 relative z-10 top-[-14px] max-w-full overflow-hidden text-ellipsis"
                        placeholder="Enter text"
                    />
                )}
            </div>
            <div className="flex justify-end mt-16 mr-20">
                <div className="bg-lime-300 rounded-lg shadow-sm border border-black-100 p-8 w-1/2">
                    <h1 className="text-blue-600 text-3xl font-bold mb-8 tracking-tight">
                        PROBATIONARY PERIOD
                    </h1>
                    <div className="text-blue-600 leading-relaxed">
                        <p>
                            The first [Probation Period Length] of employment will be a
                            probationary period. The Company shall assess the Employee’s
                            performance and suitability during this time. The Company may
                            extend the probationary period by up to [Probation Extension
                            Length] if further assessment is required. During the probationary
                            period, either party may terminate the employment by providing
                            [one week's] written notice. Upon successful completion, the
                            Employee will be confirmed in their role.]{" "}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end absolute bottom-20 right-20">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
                    onClick={handleFinishClick}
                >
                    Finish
                </button>
            </div>
            <div className="flex justify-start absolute bottom-20 left-20">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
                    onClick={handleBackClick}
                >
                    Back
                </button>
            </div>
        </div>
    );
}
export default Live_Generation;