import { Routes, Route } from "react-router";
import HomePage from "../Pages/HomePage";
import LevelOneQuizPage from "../Pages/LevelOneQuizPage";
import Level2 from "../Pages/LevelTwo";
import LevelTwoPart_Two from "../Pages/Level2_PartTwo";
import MatchingExercise from "../components/MatchingExercise";
import { matchingData } from "../data/matchingData";
import LevelOneDesign from "../Pages/Level1_newDesign";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Dashboard from "../Pages/Dashboard";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two" element={<Level2 />} />
      <Route path="/Matching-Exercise" element={<MatchingExercise data={matchingData} />} />
      <Route path="Level-Two-Part-Two" element={<LevelTwoPart_Two />} />
      <Route path="Level-One-Design" element={<LevelOneDesign />} />
    </Routes>
  );
};

export default AppRoutes;
