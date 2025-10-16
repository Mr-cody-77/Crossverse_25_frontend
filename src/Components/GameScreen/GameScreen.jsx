import { useState, useEffect } from "react";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import { questionsData } from "../questions";
import "./GameScreen.css";
import Timer from "../Timer/Timer";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "../Hyperspeed/Hyperspeed";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected, setIsDone }) {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(Number(localStorage.getItem("user_score")) || 0);
  // const [score, setScore] = useState(0);
  const player_name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Number(localStorage.getItem("start_time")) || Date.now());
  // const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const backend_url=process.env.REACT_APP_BACKEND;
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

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 40);
    setQuestions(shuffledQuestions);
  }, []);

  // code to store time and score

  useEffect(() => {
    localStorage.setItem("user_score", score);
    localStorage.setItem("start_time", startTime);
    // console.log(score);
  }, [score, startTime]);

  useEffect(() => {
    // console.log(score);
    const fetchPlayerStatus = async () => {
      try {
        const player_name = localStorage.getItem("name"); // Retrieve player name from localStorage
  
        if (!player_name) {
          console.error("No player name found in localStorage");
          return;
        }
  
        const response = await fetch(`${backend_url}/api/player/`);
        if (!response.ok) {
          throw new Error("Failed to fetch player status");
        }
        const data = await response.json(); // Parse JSON response
        // Find the player in the response data
        const player = data.find((p) => p.name === player_name);
        if (player) {
          if (player.is_complete) {
            localStorage.setItem("isDone", "true"); // Navigate to riddles if is_complete is true
          } else {
            localStorage.setItem("isDone", "false"); // Navigate to alter if is_complete is false
          }
        } else {
          console.error("Player not found in the database");
        }
      } catch (error) {
        console.error("Error fetching player status:", error);
      }
    };
  
    fetchPlayerStatus();
  }, [navigate]);

  useEffect(() => {
    // console.log(score);
    const isDone = localStorage.getItem("isDone")
    // console.log(isDone==="true");
    if (isDone==="true") {
      setIsDone(true);
    }
  }, []);
  


  const handleAnswerSelected = async (optionIndex) => {
    if (questions.length === 0) return; // Prevent errors if questions haven't loaded

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = (optionIndex+1) === Number(currentQuestion.correctAnswer);
    const isFinalQuestion = currentQuestionIndex === 39;
    // console.log(isCorrect)
    // console.log(currentQuestion.correctAnswer)

    // Tree Traversal Logic
    let currentNode = treeData;
    const pathToUpdate = [...selectedPath];

    // Traverse tree
    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i];
      const childIndex = currentNode.children.findIndex((child) => child.id === childId);
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex];
      }
    }

    const selectedChild = currentNode.children[optionIndex];
    if (!selectedChild) return;

    const newPath = [...pathToUpdate, selectedChild.id];
    setSelectedPath(newPath);

    // Generate new children if none exist
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
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        // console.log("Updated Score:", newScore);
  
        if (newScore === 10 && localStorage.getItem("submitted") !== "true") {
          localStorage.setItem("submitted", "true");
          localStorage.setItem("isDone", "true");
         
          alert("You have collected all the keys. Now you can proceed to the next round.");
          // Wait for backend confirmation before redirect
fetch(`${backend_url}/api/player/`)
  .then((response) => response.json())
  .then((players) => {
    const player = players.find((p) => p.name === player_name);

    if (player) {
      return fetch(`${backend_url}/api/player/${player.id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }
  })
  .then(() =>
    fetch(`${backend_url}/api/player/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: player_name, is_complete: true, score: 10 }),
    })
  )
  .then(() => {
    // ✅ backend updated, now safe to navigate
    navigate("/riddles");
  })
  .catch((error) => {
    console.error("Error updating player status:", error);
    alert("Something went wrong saving your progress.");
  });
          
          fetch(`${backend_url}/api/player/`)
            .then((response) => response.json())
            .then((players) => {
              const player = players.find((p) => p.name === player_name);
  
              if (player) {
                fetch(`${backend_url}/api/player/${player.id}/`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                })
                  .then((res) => {
                    if (!res.ok) throw new Error("Failed to delete previous player entry");
                    // console.log("Previous player entry deleted successfully.");
  
                    return fetch(`${backend_url}/api/player/`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: player_name, is_complete: true, score: newScore }),
                    });
                  })
                  .then((res) => {
                    if (!res.ok) throw new Error("Failed to re-add player with completion status");
                    // console.log("Player completion status updated successfully!");
                  })
                  .catch((error) => console.error("Error updating player status:", error));
              } else {
                fetch(`${backend_url}/api/player/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: player_name, is_complete: true, score: newScore }),
                })
                  .then((res) => {
                    if (!res.ok) throw new Error("Failed to add player");
                    // console.log("Player added successfully!");
                  })
                  .catch((error) => console.error("Error adding player:", error));
              }
            })
            .catch((error) => console.error("Error fetching player data:", error));

            
  
          /*fetch(`${backend_url}/api/leaderboard/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: player_name, time: Date.now() - startTime }),
          })
            .then((response) => {
              if (!response.ok) throw new Error("Error submitting score");
              // console.log("Score submitted successfully!");
            })
            .catch((error) => console.error("Submission error:", error));*/
        }
        return newScore;
      });
    }
  
    if (isFinalQuestion) {
      setGameCompleted(true);
      navigate("/eliminated");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleTimeUpdate = (time) => {
    setElapsedTime(time);
  };

  return (
   
    <div className="game-screen mt-[70px] relative">
      <Hyperspeed speed={1}/>
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
              question={
                questions[currentQuestionIndex] || { text: "", options: [] }
              }
              onAnswerSelected={handleAnswerSelected}
            />
          )}
            
        </div>
        
     
        <div className="tree-visualization-container">

          <TreeVisualization treeData={treeData} selectedPath={selectedPath} />
        </div>
      </div>
    </div>
    
  </div>
      
  );   
}

export default GameScreen;