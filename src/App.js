import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GameScreen from "./Components/GameScreen/GameScreen";
import Leaderboard from "./Components/LeaderBoard/LeaderBoard";
import EliminationPage from "./Components/EliminationPage/EliminationPage";
import Riddles from "./Components/Riddles/Riddles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Crossword from "./Components/Crossword/Crossword";
import Intro from "./Components/Intro/Intro";
import AlterPage from "./Components/AlterPage/AlterPage";
import "./App.css";
import RulesPage from "./Components/RulesPages/RulesPage";
import Background from "./Components/Background";
import MainLayout from "./Components/Layouts/MainLayout";
import WinnerPage from "./Components/WinnerPages/WinnerPage";

function App() {
  const [riddles, setRiddles] = useState([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isEliminated, setIsEliminated] = useState(false);
  const [isDone, setIsDone] = useState(
    localStorage.getItem("isDone") === "true" || false
  );

  const [isLogin, setIsLogin] = useState(false)

  const handleRiddleCollected = (riddle) => {
    setRiddles((prev) => [...prev, riddle]);
    if (riddles.length + 1 >= 10) {
      setIsGameCompleted(true);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={
              
              <Intro/>
            } />
            <Route
              path="/adventure"
              element={
                <MainLayout>
                  <Background/>
                  <GameScreen
                    onRiddleCollected={handleRiddleCollected}
                    isGameCompleted={isGameCompleted}
                    setIsEliminated={setIsEliminated}
                    setIsDone={setIsDone}
                    setIsLogin={setIsLogin}
                  />
                </MainLayout>
              }
            />
            <Route path="/eliminated" element={<EliminationPage />} />
            <Route
              path="/leaderboard"
              element={
                <MainLayout>
                  <Background/>
                  <Leaderboard />
                </MainLayout>
              }
            />
            <Route
              path="/crossword"
              element={
                isDone  ? (
                  <MainLayout>
                    <Background />
                    <Crossword />
                  </MainLayout>
                ) : (
                  <Navigate to="/alter" />
                )
                
              }
            />
            <Route
              path="/winner"
              element={
                isDone ? (
                  <MainLayout>
                    <Background />
                    <WinnerPage />
                  </MainLayout>
                ) : (
                  <Navigate to="/alter" />
                )
              }
            />
            <Route
              path="/Rules"
              element={
                <MainLayout>
                <Background/>
                  <RulesPage />
                </MainLayout>
              }
            />
            <Route
              path="/riddles"
              element={
                isDone   ? (
                  <MainLayout>
                    <Background />
                    <Riddles />
                  </MainLayout>
                ) : (
                  <Navigate to="/alter" />
                )
              }
            />
            <Route
              path="/alter"
              element={
                <MainLayout>
                  <Background />
                  <AlterPage />
                </MainLayout>
              }
            />
          </Routes>

          
          
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
