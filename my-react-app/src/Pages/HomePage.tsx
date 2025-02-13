import React, { useState, useMemo } from "react";
import { FaFileAlt, FaProjectDiagram, FaHandshake } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";

interface LevelProps {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}

const LevelCard = ({ title, description, Icon, active, onClick }: LevelProps) => (
  <div
    className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl relative 
      ${active 
        ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/20" 
        : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 border border-gray-200"
      }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg 
        ${active 
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
          : "bg-gradient-to-br from-gray-200 to-gray-300"
        }`}
      >
        <Icon className="text-xl" />
      </div>
      <h3 className={`font-semibold text-lg ${active ? "text-blue-900" : "text-gray-800"}`}>{title}</h3>
    </div>
    <p className={`text-sm leading-relaxed ${active ? "text-gray-700" : "text-gray-600"}`}>{description}</p>
    {active && (
      <div className="flex justify-center mt-4">
        <button className="px-6 py-2.5 max-w-[200px] cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
          Start Level
        </button>
      </div>
    )}
  </div>
);

const levelsData = [
  {
    title: "Document Builder",
    description: "Create and manage professional contracts using our intuitive drag-and-drop interface",
    Icon: FaFileAlt
  },
  {
    title: "Workflow Master",
    description: "Design, optimize, and automate complex approval workflows for maximum efficiency",
    Icon: FaProjectDiagram
  },
  {
    title: "Negotiation Expert",
    description: "Master the art of navigating and resolving complex stakeholder requirements",
    Icon: FaHandshake
  },
  {
    title: "CLM Detective",
    description: "Analyze and solve real-world contract lifecycle management challenges",
    Icon: LuBrain
  }
];

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const levels = useMemo(() => levelsData, []);

  const handleLevelClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4 py-36 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CLM Training</h1>
            <p className="text-gray-600">Select a learning path to begin your contract management journey</p>
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
