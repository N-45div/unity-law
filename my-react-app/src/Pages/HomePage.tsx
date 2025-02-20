import { useMemo } from "react";
import { FaFileAlt, FaProjectDiagram, FaHandshake } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import backgroundImage from '../assets/quizBackground.png';
import iconImage from '../assets/quizIcon.png';
import { Link } from "react-router";
import Header from "./Header";

const levelsData = [
  {
    title: "Level 1",
    description:
      "Create and manage professional contracts using our intuitive drag-and-drop interface",
    Icon: FaFileAlt,
    link: "/Level-One-Quiz",
  },
  {
    title: "Level 2",
    description:
      "Design, optimize, and automate complex approval workflows for maximum efficiency",
    Icon: FaProjectDiagram,
    link: "/Level-Two-Quiz",
  },
  {
    title: "Level 3",
    description:
      "Master the art of navigating and resolving complex stakeholder requirements",
    Icon: FaHandshake,
    link: "/Level-Three-Quiz",
  },
  {
    title: "Level 4",
    description:
      "Analyze and solve real-world contract lifecycle management challenges",
    Icon: LuBrain,
    link: "/Level-Four-Quiz",
  },
];

const showNavBar = true;  // set to false to disable nav bar

const HomePage = () => {
  const levels = useMemo(() => levelsData, []);

  const buttonStyle = {
    fontFamily: "'Pixelify Sans' , sans-serif",
    display: "flex",
    fontWeight: 400,
    fontSize: "35px",
    color: "black",
    textTransform: "uppercase" as "uppercase",


  }

  function LevelComponent({ levelName }: { levelName: string }) {
    const levelIndex = levels.findIndex(level => level.title === levelName);
    const levelData = levels[levelIndex];
    return (
      <button 
        className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7] m-2, p-2"
      >
        <Link to={levelData.link} style={buttonStyle}>{levelName}</Link>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "100% 100%",
    }}>

{/* 
      <div className="flex justify-between ">
        <img
          src={iconImage}
          alt="Icon"
          style={{ width: "150px", height: "150px" }}
        />
        <div className="flex gap-6 items-center">
          <button className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]">
            <div style={buttonStyle}>FUN FACT</div>
          </button>
          <button className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7]"><div style={buttonStyle}>PROGRESS</div></button>
        </div>
      </div> */}
      {showNavBar && <Header />}

      <div className="max-w-7xl  py-15 text-center ">

        <p className=" text-[54px] font-bold text-white [font-family:'Roboto',sans-serif] mb-10">Lawyal Tech the intersection of Law and gaming </p>
        <button className="w-auto bg-gradient-to-r from-[#FFF3B1] to-[#FFABF7] m-2, p-2">
          {/* <div style={buttonStyle}>ABOUT US</div> */}
          <a href="#" style={buttonStyle}>ABOUT US</a>
        </button>
        <h3 className="text-3xl font-bold text-white [font-family:'Roboto',sans-serif] mt-25 mb-15">Play the Game Now !</h3>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {levels.map(level => {
            return <LevelComponent key={level.title} levelName={level.title} />
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
