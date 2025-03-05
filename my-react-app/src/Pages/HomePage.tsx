import React, { useState, useMemo } from "react";
import {
  FaFileAlt,
  FaProjectDiagram,
  FaHandshake,
  FaTimes,
  FaChevronRight,
  FaRegLightbulb,
  FaPuzzlePiece,
} from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { LuBrain } from "react-icons/lu";
import { useNavigate } from "react-router";
import Header from "./Header";

interface LevelProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  link: string;
  isLevel2?: boolean;
}

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPart: (part: string) => void;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  onSelectPart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 rounded-xl backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg mx-4 transform transition-all duration-300 ease-out animate-scale-in"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">
              Choose Your Path
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FaTimes className="text-gray-400 hover:text-gray-600 text-xl" />
            </button>
          </div>
          <p className="text-gray-500 mt-2">Select which part you'd like to explore</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Part One Button */}
            <button
              onClick={() => onSelectPart("one")}
              className="group relative flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
            >
              <div className="bg-blue-500 p-3 rounded-lg">
                <FaRegLightbulb className="text-white text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-lg font-semibold text-blue-900">Part One</h4>
                <p className="text-blue-600 text-sm">Match The Following</p>
              </div>
              <FaChevronRight className="absolute right-4 text-blue-400 group-hover:text-blue-600 group-hover:transform group-hover:translate-x-1 transition-all" />
            </button>

            {/* Part Two Button */}
            <button
              onClick={() => onSelectPart("two")}
              className="group relative flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-lime-100 hover:to-lime-200 transition-all duration-300"
            >
              <div className="bg-lime-500 p-3 rounded-lg">
                <FaPuzzlePiece className="text-white text-xl" />
              </div>
              <div className="ml-4 text-left">
                <h4 className="text-lg font-semibold text-lime-900">Part Two</h4>
                <p className="text-lime-600 text-sm">Automate Employment Agreement</p>
              </div>
              <FaChevronRight className="absolute right-4 text-lime-400 group-hover:text-lime-600 group-hover:transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500 text-center">
            You can always switch between parts later
          </p>
        </div>
      </div>
    </div>
  );
};

const LevelCard = ({
  title,
  description,
  Icon,
  active,
  onClick,
  link,
  isLevel2,
}: LevelProps) => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleStartLevel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLevel2) {
      setShowDialog(true);
    } else {
      navigate(link);
    }
  };

  const handleSelectPart = (part: string) => {
    setShowDialog(false);
    if (part === "one") {
      navigate("/Level-Two-Part-One");
    } else {
      navigate("/Level-Two-Part-Two");
    }
  };

  return (
    <>
      <div
        className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl relative 
          ${
            active
              ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20"
              : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200"
          }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg 
            ${
              active
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                : "bg-gradient-to-br from-gray-200 to-gray-300"
            }`}
          >
            <Icon className="text-xl" />
          </div>
          <h3
            className={`font-semibold text-lg ${
              active ? "text-blue-900" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            active ? "text-gray-700" : "text-gray-600"
          }`}
        >
          {description}
        </p>
        {active && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleStartLevel}
              className="px-6 py-2.5 max-w-[200px] cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
            >
              Start Level
            </button>
          </div>
        )}
      </div>

      <CustomDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onSelectPart={handleSelectPart}
      />
    </>
  );
};

const levelsData = [
  {
    title: "Document Builder",
    description:
      "Create and manage professional contracts using our intuitive drag-and-drop interface",
    Icon: FaFileAlt,
    link: "/Level-One-Quiz",
  },
  {
    title: "Document Automation Game",
    description:
      "You will learn to automate employment agreements using placeholders, simple and complex conditional logic.",
    Icon: GrDocumentConfig,
    link: "/Level-Two",
    isLevel2: true,
  },
  {
    title: "Negotiation Expert",
    description:
      "Master the art of navigating and resolving complex stakeholder requirements",
    Icon: FaHandshake,
    link: "/Level-Three-Quiz",
  },
  {
    title: "CLM Detective",
    description:
      "Analyze and solve real-world contract lifecycle management challenges",
    Icon: LuBrain,
    link: "/Level-Four-Quiz",
  },
];

const showNavBar = true;  // set to false to disable nav bar

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const levels = useMemo(() => levelsData, []);

  const handleLevelClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8">
      {showNavBar && <Header />}
      <div className="max-w-7xl mx-auto py-36 ">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to CLM Training
            </h1>
            <p className="text-gray-600">
              Select a learning path to begin your contract management journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map((level, index) => (
              <LevelCard
                key={index}
                {...level}
                active={index === activeIndex}
                onClick={() => handleLevelClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default HomePage;
