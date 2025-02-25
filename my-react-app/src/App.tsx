import { Routes, Route } from "react-router";
import HomePage from "./Pages/HomePage";
import LevelOneQuizPage from "./Pages/LevelOneQuizPage";
import Level2 from "./Pages/Level2";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two-Quiz" element={<Level2 />} />
    </Routes>
  );
};

export default App;
