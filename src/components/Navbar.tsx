import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { FaTools, FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

// Define the props interface
interface NavbarProps {
  level?: string;
  questionnaire?: string;
  live_generation?: string;
  calculations?: string;
}

const Navbar = ({ level, questionnaire, live_generation, calculations }: NavbarProps) => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const navigation = useNavigate();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    const routes: Record<string, string> = {
      "/Level-Two-Part-Two": "Document",
      "/Questionnaire": "Questionnaire",
      "/Live_Generation": "Live Document Generation",
      "/Live_Generation_2": "Live Document Generation",
      "/Finish": "Generated Document",
      // Add custom routes from props if provided
      ...(level && { [level]: "Document" }),
      ...(questionnaire && { [questionnaire]: "Questionnaire" }),
      ...(live_generation && { [live_generation]: "Live Document Generation" }),
      ...(calculations && { [calculations]: "Calculations" }),
    };

    const activeLabel = routes[location.pathname] || null;
    console.log("Current pathname:", location.pathname, "Active label:", activeLabel);
    setActiveButton(activeLabel);
  }, [location.pathname, level, questionnaire, live_generation, calculations]);

  const handlePageChange = (label: string) => {
    const routes: Record<string, string> = {
      Document: level || "/Level-Two-Part-Two",
      Questionnaire: questionnaire || "/Questionnaire",
      "Live Document Generation": live_generation || "/Live_Generation",
      "Generated Document": "/Finish",
      Calculations: calculations || "/Calculations",
    };

    const path = routes[label];
    console.log("Navigating to:", path);
    if (path) {
      navigation(path);
    }
  };

  return (
    <div
      className={`w-full shadow-md sticky top-0 z-50 transition-all duration-500 ${
        isDarkMode ? "bg-gray-800" : "bg-lime-300"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1 flex">
            {location.pathname !== "/Finish" ? (
              ["Document", "Questionnaire", "Live Document Generation", "Calculations"].map((label, idx) => (
                <button
                  id={
                    idx === 1
                      ? "Questionnaire-button"
                      : idx === 2
                      ? "live-document-generation"
                      : idx === 0
                      ? "document-page"
                      : idx === 3
                      ? "calculations-page"
                      : undefined
                  }
                  key={label}
                  className={`px-8 py-3 cursor-pointer font-medium border-r border-lime-400 transition-colors duration-200 flex items-center space-x-2 ${
                    activeButton === label
                      ? isDarkMode
                        ? "text-teal-300"
                        : "text-gray-700"
                      : isDarkMode
                      ? "text-white"
                      : "text-blue-600"
                  } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-lime-400"}`}
                  onClick={() => handlePageChange(label)}
                >
                  <span>{label}</span>
                </button>
              ))
            ) : (
              <div className="flex-1 flex justify-end pr-75">
                <span
                  className={`px-8 py-3 font-medium flex items-center space-x-2 text-xl ${
                    isDarkMode ? "text-teal-300" : "text-blue-600"
                  }`}
                >
                  <span>Generated Document</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center px-6 space-x-6">
            <span
              className={`text-xl font-semibold tracking-wide ${
                isDarkMode ? "text-teal-300" : "text-blue-600"
              }`}
            >
              Contractual
            </span>
            <div className="relative flex items-center">
              <button
                className={`p-2 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center text-2xl ${
                  isDarkMode ? "text-white hover:bg-gray-700" : "text-blue-600 hover:bg-lime-400"
                }`}
                onMouseEnter={() => setTooltip("Settings")}
                onMouseLeave={() => setTooltip(null)}
              >
                <FaTools />
              </button>
              {tooltip === "Settings" && (
                <div
                  className={`absolute top-full mb-2 px-3 py-1 text-sm rounded shadow-md whitespace-nowrap ${
                    isDarkMode ? "text-white bg-gray-700" : "text-white bg-gray-500"
                  }`}
                >
                  Settings
                </div>
              )}
            </div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 relative left-[12vw] rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
                isDarkMode
                  ? "bg-gray-600 text-yellow-400 hover:bg-gray-100"
                  : "bg-lime-900 text-white hover:bg-black"
              } flex items-center justify-center text-xl`}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;