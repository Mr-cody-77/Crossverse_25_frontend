import { useState, useEffect } from "react";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import { questionsData } from "../questions";
import "./GameScreen.css";
import Timer from "../Timer/Timer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "../Hyperspeed/Hyperspeed";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected, setIsDone }) {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(Number(localStorage.getItem("user_score")) || 0);
  const player_name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(Number(localStorage.getItem("current_question_index")) || 0); // ✅ fetch from localStorage
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Number(localStorage.getItem("start_time")) || Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const backend_url = process.env.REACT_APP_BACKEND;
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

  // Shuffle questions once on mount
  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 40);
    setQuestions(shuffledQuestions);
  }, []);

  // Persist score, start time, and current question
  useEffect(() => {
    localStorage.setItem("user_score", score);
    localStorage.setItem("start_time", startTime);
    localStorage.setItem("current_question_index", currentQuestionIndex); // ✅ store question index
  }, [score, startTime, currentQuestionIndex]);

  useEffect(() => {
    const fetchPlayerStatus = async () => {
      try {
        const player_name = localStorage.getItem("name");
        if (!player_name) return;

        const response = await fetch(`${backend_url}/api/player/`);
        if (!response.ok) throw new Error("Failed to fetch player status");

        const data = await response.json();
        const player = data.find((p) => p.name === player_name);
        if (player) {
          localStorage.setItem("isDone", player.is_complete ? "true" : "false");
        }
      } catch (error) {
        console.error("Error fetching player status:", error);
      }
    };
    fetchPlayerStatus();
  }, [navigate]);

  useEffect(() => {
    if (localStorage.getItem("isDone") === "true") {
      setIsDone(true);
    }
  }, []);

  const handleAnswerSelected = async (optionIndex) => {
    if (questions.length === 0) return;

    setLoading(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = (optionIndex + 1) === Number(currentQuestion.correctAnswer);
    const isFinalQuestion = currentQuestionIndex === 39;

    let currentNode = treeData;
    const pathToUpdate = [...selectedPath];

    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i];
      const childIndex = currentNode.children.findIndex((child) => child.id === childId);
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex];
      }
    }

    const selectedChild = currentNode.children[optionIndex];
    if (!selectedChild) {
      setLoading(false);
      return;
    }

    const newPath = [...pathToUpdate, selectedChild.id];
    setSelectedPath(newPath);

    if (selectedChild.children.length === 0) {
      const newChildren = [
        { id: `${selectedChild.id}-0`, name: "A", children: [] },
        { id: `${selectedChild.id}-1`, name: "B", children: [] },
        { id: `${selectedChild.id}-2`, name: "C", children: [] },
        { id: `${selectedChild.id}-3`, name: "D", children: [] },
      ];

      const newTreeData = JSON.parse(JSON.stringify(treeData));
      let nodeToUpdate = newTreeData;

      for (let i = 1; i < pathToUpdate.length; i++) {
        const childId = pathToUpdate[i];
        const childIndex = nodeToUpdate.children.findIndex((child) => child.id === childId);
        if (childIndex !== -1) {
          nodeToUpdate = nodeToUpdate.children[childIndex];
        }
      }

      const childIndex = nodeToUpdate.children.findIndex((child) => child.id === selectedChild.id);
      if (childIndex !== -1) {
        nodeToUpdate.children[childIndex].children = newChildren;
      }

      setTreeData(newTreeData);
    }

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (isFinalQuestion) {
      setTimeout(() => {
        setLoading(false);
        setGameCompleted(true);
        navigate("/eliminated");
      }, 600);
    } else {
      setTimeout(() => {
        setLoading(false);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 600);
    }
  };

  const handleTimeUpdate = (time) => setElapsedTime(time);

  return (
    <div className="game-screen mt-[70px] relative">
      <Hyperspeed speed={1} />
      <div className="relative z-10">
        <Navbar />

        <div className="game-header">
          <h1 className="Round-1h1">Round-1</h1>
          <div className="progress-indicator">
            <span>
              Questions: {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        <Timer
          gameOver={gameCompleted}
          startTime={startTime}
          onTimeUpdate={handleTimeUpdate}
        />

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
