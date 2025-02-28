import { Routes, Route } from "react-router";
import HomePage from "./Pages/HomePage";
import LevelOneQuizPage from "./Pages/LevelOneQuizPage";
import MatchingExercise from "./components/MatchingExercise";
import { matchingData } from "./data/matchingData";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two-Quiz" element={<MatchingExercise data={matchingData} />} />
    </Routes>
  );
};

export default App;
