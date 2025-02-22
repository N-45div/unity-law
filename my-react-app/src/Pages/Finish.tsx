import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";
import Confetti from "react-confetti";  // need npm install react-confetti

const Finish = () => {
    const [confetti, setConfetti] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        setConfetti(true);
        // setTimeout(() => setConfetti(false), 3000);
    }, []);

    const handleBackClick = () => {
        navigation("/");
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-100 via-purple-100 to-blue-100 relative">
            {confetti && <Confetti />}
            
            <Navbar />
            <div className="flex justify-center mt-16">
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
            <div className="flex justify-center mt-30">
                <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:scale-110 transition-all duration-300"
                    onClick={handleBackClick}
                >
                    Return to Home Page
                </button>
            </div>
            
        </div>
    );
}
export default Finish;