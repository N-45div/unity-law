import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { FaTools } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    const routes: Record<string, string> = {
      "/Level-Two-Part-Two": "Document",
      "/Questionnaire": "Questionnaire",
      "/Live_Generation": "Live Document Generation",
      "/Live_Generation_2": "Live Document Generation"
    };

    setActiveButton(routes[location.pathname] || null);
  }, [location.pathname]);

  const handlePageChange = (label: string) => {
    const routes: Record<string, string> = {
      Document: "/Level-Two-Part-Two",
      Questionnaire: "/Questionnaire",
      "Live Document Generation": "/Live_Generation",
    };

    navigation(routes[label]);
  };

  return (
    <div className="w-full bg-lime-300 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex">
            {["Document", "Questionnaire", "Live Document Generation"].map(
              (label) => (
                <button
                  key={label}
                  className={`px-8 py-3 cursor-pointer bg-lime-300 font-medium border-r border-lime-400 hover:bg-lime-400 transition-colors duration-200 flex items-center space-x-2 ${
                    activeButton === label ? "text-gray-700" : "text-blue-600"
                  }`}
                  onClick={() => handlePageChange(label)}
                >
                  <span>{label}</span>
                </button>
              )
            )}
          </div>
          <div className="flex items-center px-6 space-x-6">
            <span className="text-blue-600 text-xl font-semibold tracking-wide">
              Contractual
            </span>
            <div className="relative flex items-center">
              <button
                className="p-2 rounded-full cursor-pointer hover:bg-lime-400 transition-colors duration-200 flex items-center justify-center text-2xl"
                onMouseEnter={() => setTooltip("Settings")}
                onMouseLeave={() => setTooltip(null)}
              >
                <FaTools />
              </button>
              {tooltip === "Settings" && (
                <div className="absolute top-full mb-2 px-3 py-1 text-sm text-white bg-gray-500 rounded shadow-md whitespace-nowrap">
                  Settings
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
