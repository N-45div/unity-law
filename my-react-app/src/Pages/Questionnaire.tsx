import Navbar from "../components/Navbar";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";

const DivWithDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string>("Select a question");
    const [text, setText] = useState<string>("");

    const handleSelect = (item: string) => {
        setSelectedItem(item);
        setIsOpen(false); // Close dropdown after selection
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
                    {/* Left Horizontal Line */}
                    <div className="h-0.5 w-2/5 bg-black absolute left-0"></div>

                    {/* Text Input on the Line */}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="px-2 py-1 text-sm border-none bg-transparent outline-none w-2/5 relative z-10 top-[-14px] max-w-full overflow-hidden text-ellipsis"
                        placeholder="Enter text"
                    />
                </div>

                {/* Dropdown Button (Arrow + Selected Item) */}
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center space-x-2">
                    <span className="text-black text-sm">{selectedItem}</span>
                    <button
                        className="text-black text-xl transition-transform duration-200 hover:scale-110"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FaChevronDown className={`${isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-200`} />
                    </button>
                </div>

                {/* Dropdown Menu (Visible when isOpen is true) */}
                {isOpen && (
                    <div className="absolute top-25 right-3 bg-white text-black rounded-md shadow-md w-40 mt-1 z-10">
                        <ul className="text-sm">
                            {["Q1", "Q2", "Q3"].map((item) => (
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
    const [leftActive, setLeftActive] = useState(true); // Tracks if left label is active
    const [rightActive, setRightActive] = useState(false);
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            <Navbar />
            <div className="absolute top-16 right-6 w-80 h-10 bg-lime-300 rounded-lg shadow-md flex items-center justify-center text-black text-sm font-semibold">
                <div className="flex items-center space-x-4">
                    {/* Left Label and Arrow */}
                    <div
                        className={`flex items-center space-x-2 ${leftActive ? "text-blue-600" : "text-gray-600"}`}
                    >
                        <span>Employer</span>
                    </div>

                    {/* Arrows */}
                    <div className="flex items-center space-x-2">
                        <button onClick={() => { setLeftActive(true); setRightActive(false); }}>
                            <FaChevronLeft className="text-xl hover:scale-110" />
                        </button>
                        <button onClick={() => { setRightActive(true); setLeftActive(false); }}>
                            <FaChevronRight className="text-xl hover:scale-110" />
                        </button>
                    </div>

                    {/* Right Label */}
                    <div
                        className={`flex items-center space-x-2 ${rightActive ? "text-blue-600" : "text-gray-600"}`}
                    >
                        <span>Employee</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-20">
                <DivWithDropdown />
                <DivWithDropdown />
            </div>
        </div>
    );
};

export default Questionnaire;
