import { Routes, Route } from "react-router";
import HomePage from "../Pages/HomePage";
import LevelOneQuizPage from "../Pages/LevelOneQuizPage";
import Level2 from "../Pages/Level2";
import LevelTwoPart_Two from "../Pages/Level2_PartTwo";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two" element={<Level2 />} />
      <Route path="Level-Two-Part-Two" element={<LevelTwoPart_Two />} />
    </Routes>
  );
};

export default AppRoutes;
