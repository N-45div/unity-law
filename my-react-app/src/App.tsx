import { Routes, Route } from "react-router";
import HomePage from "./Pages/HomePage";
import LevelOneQuizPage from "./Pages/LevelOneQuizPage";
import LevelTwoQuiz from "./Pages/LevelTwo";
import MatchingExercise from "./components/MatchingExercise";
import { matchingData } from "./data/matchingData";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two-Quiz" element={<LevelTwoQuiz />} />
      <Route path="/Level-Two-Quiz-match" element={<MatchingExercise data={matchingData} />} />
    </Routes>
  );
};

export default App;
