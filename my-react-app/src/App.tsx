import { Routes, Route, Navigate, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import LevelOneQuizPage from "./Pages/LevelOneQuizPage";
import Level2 from "./Pages/LevelTwo";
import LevelTwoPart_Two from "./Pages/Level2_PartTwo";
import Questionnaire from "./Pages/Questionnaire";
import Live_Generation from "./Pages/Live_Generation";
import Finish from "./Pages/Finish";
import { HighlightedTextProvider } from "./context/HighlightedTextContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./Routes/ProtectedRoute";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#f8f9fa" }}>
      <h1>My App</h1>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={logout} style={{ marginLeft: "10px", cursor: "pointer" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" style={{ marginLeft: "10px" }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p>Loading...</p>; // Prevent flickering while checking authentication
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/Level-One-Quiz" element={<ProtectedRoute><LevelOneQuizPage /></ProtectedRoute>} />
        <Route path="/Level-Two-Part-One" element={<ProtectedRoute><Level2 /></ProtectedRoute>} />
        <Route path="/Level-Two-Part-Two" element={<ProtectedRoute><LevelTwoPart_Two /></ProtectedRoute>} />
        <Route path="/Questionnaire" element={<ProtectedRoute><Questionnaire /></ProtectedRoute>} />
        <Route path="/Live_Generation" element={<ProtectedRoute><Live_Generation /></ProtectedRoute>} />
        <Route path="/Finish" element={<ProtectedRoute><Finish /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HighlightedTextProvider>
        <AppContent />
      </HighlightedTextProvider>
    </AuthProvider>
  );
};

export default App;
