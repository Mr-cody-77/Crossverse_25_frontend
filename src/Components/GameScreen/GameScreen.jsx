import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import { questionsData } from "../questions";
import "./GameScreen.css";
import Timer from "../Timer/Timer";
import Navbar from "../Navbar/Navbar";
import Hyperspeed from "../Hyperspeed/Hyperspeed";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected, setIsDone }) {
  const navigate = useNavigate();
  const backend_url = process.env.REACT_APP_BACKEND;
  const player_name = localStorage.getItem("name");

  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(Number(localStorage.getItem("user_score")) || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Number(localStorage.getItem("start_time")) || Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState({
    id: "root",
    name: "Start",
    children: [
      { id: "1", name: "A", children: [] },
      { id: "2", name: "B", children: [] },
      { id: "3", name: "C", children: [] },
      { id: "4", name: "D", children: [] },
    ],
  });
  const [selectedPath, setSelectedPath] = useState(["root"]);

  // Shuffle questions on mount
  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 40);
    setQuestions(shuffledQuestions);
  }, []);


  // Store score and start time in localStorage
  useEffect(() => {
    localStorage.setItem("user_score", score);
    localStorage.setItem("start_time", startTime);
  }, [score, startTime]);
  useEffect(() => {
    console.log("🎯 Current Score:", score);
  }, [score]);

  useEffect(() => {
  const storedScore = Number(localStorage.getItem("user_score")) || 0;
  const alreadySubmitted = localStorage.getItem("submitted") === "true";

  if (storedScore >= 10 && !alreadySubmitted) {
    localStorage.setItem("submitted", "true");
    alert("You have collected all the keys. Now you can proceed to the next round.");
    updatePlayerCompletion(storedScore);
  }
}, []);
  // Fetch player status from backend
  useEffect(() => {
    const fetchPlayerStatus = async () => {
      try {
        if (!player_name) {
          console.error("No player name found in localStorage");
          return;
        }

        const response = await fetch(`${backend_url}/api/player/`);
        if (!response.ok) throw new Error("Failed to fetch player status");

        const data = await response.json();
        const player = data.find((p) => p.name === player_name);

        if (player) {
          localStorage.setItem("isDone", player.is_complete ? "true" : "false");
        } else {
          console.error("Player not found in the database");
        }
      } catch (error) {
        console.error("Error fetching player status:", error);
      }
    };

    fetchPlayerStatus();
  }, [backend_url, player_name]);

  // Update isDone state from localStorage
  useEffect(() => {
    const isDone = localStorage.getItem("isDone");
    if (isDone === "true") {
      setIsDone(true);
    }
  }, [setIsDone]);

  // ✅ Helper to update player completion status in backend
  const updatePlayerCompletion = async (finalScore) => {
    try {
      setLoading(true);
      const response = await fetch(`${backend_url}/api/player/`);
      const players = await response.json();
      const player = players.find((p) => p.name === player_name);

      if (player) {
        await fetch(`${backend_url}/api/player/${player.id}/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
      }

      await fetch(`${backend_url}/api/player/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: player_name, is_complete: true, score: finalScore }),
      });

      localStorage.setItem("isDone", "true");
      navigate("/riddles");
    } catch (error) {
      console.error("Error updating player status:", error);
      alert("Something went wrong saving your progress.");
    } finally {
      setLoading(false);
      navigate("/riddles");
    }
  };

  // 🧠 Handle option selection with loading
  const handleAnswerSelected = async (optionIndex) => {
    if (questions.length === 0) return;
    setLoading(true); // 👈 show loading immediately

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex + 1 === Number(currentQuestion.correctAnswer);
    const isFinalQuestion = currentQuestionIndex === 39;

    // 🌳 Tree Traversal Logic
    let currentNode = treeData;
    for (let i = 1; i < selectedPath.length; i++) {
      currentNode = currentNode.children.find((child) => child.id === selectedPath[i]);
      if (!currentNode) {
        setLoading(false);
        return;
      }
    }

    const selectedChild = currentNode.children[optionIndex];
    if (!selectedChild) {
      setLoading(false);
      return;
    }

    const newPath = [...selectedPath, selectedChild.id];
    setSelectedPath(newPath);

    // Generate children if not present
    if (selectedChild.children.length === 0) {
      const newChildren = Array.from({ length: 4 }, (_, idx) => ({
        id: `${selectedChild.id}-${idx}`,
        name: String.fromCharCode(65 + idx),
        children: [],
      }));

      const newTreeData = JSON.parse(JSON.stringify(treeData));
      let nodeToUpdate = newTreeData;
      for (let i = 1; i < selectedPath.length; i++) {
        nodeToUpdate = nodeToUpdate.children.find((child) => child.id === selectedPath[i]);
      }

      const targetIndex = nodeToUpdate.children.findIndex((child) => child.id === selectedChild.id);
      if (targetIndex !== -1) {
        nodeToUpdate.children[targetIndex].children = newChildren;
      }

      setTreeData(newTreeData);
    }

    // ✅ Handle scoring logic
    if (isCorrect) {
      setScore((prev) => {
        const newScore = prev + 1;

        if (newScore >= 10 && localStorage.getItem("submitted") !== "true") {
          localStorage.setItem("submitted", "true");
          alert("You have collected all the keys. Now you can proceed to the next round.");
          updatePlayerCompletion(newScore);
        }

        return newScore;
      });
    }

    // ⏳ Add slight delay so overlay is visible before next question
    setTimeout(() => {
      if (isFinalQuestion) {
        setGameCompleted(true);
        navigate("/eliminated");
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
      setLoading(false); // hide after updating state
    }, 600);
  };

  const handleTimeUpdate = (time) => {
    setElapsedTime(time);
  };

  return (
    <div className="game-screen mt-[70px] relative">
      <Hyperspeed speed={1} />
      <div className="relative z-10">
        <Navbar />
        <div className="game-header">
          <h1 className="Round-1h1">Round-1</h1>
          <div className="progress-indicator">
            <span>Questions: {currentQuestionIndex + 1}/{questions.length}</span>
          </div>
        </div>

        <Timer gameOver={gameCompleted} startTime={startTime} onTimeUpdate={handleTimeUpdate} />

        <div className="game-content">
          <div className="question-panel-container text-black">
            {questions.length > 0 && (
              <QuestionPanel
                question={questions[currentQuestionIndex] || { text: "", options: [] }}
                onAnswerSelected={handleAnswerSelected}
              />
            )}
          </div>

          <div className="tree-visualization-container">
            <TreeVisualization treeData={treeData} selectedPath={selectedPath} />
          </div>
        </div>
      </div>

      {loading && <LoadingOverlay />} 
    </div>
  );
}

export default GameScreen;
