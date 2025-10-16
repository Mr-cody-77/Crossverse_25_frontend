"use client";

import { useState, useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import Timer from "../Timer/Timer";
import { generateQuestions } from "../questions";
import "./Quiz.css"; // Ensure this file has necessary styles

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [treeData, setTreeData] = useState({ id: "root", name: "Start", children: [] });
  const [selectedPath, setSelectedPath] = useState(["root"]);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  const handleAnswerSelect = (optionIndex) => {
    if (!timerStarted) {
      setTimerStarted(true);
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const newNodeId = `node-${selectedPath.length}-${optionIndex}`;

    setSelectedPath((prevPath) => [...prevPath, newNodeId]);
    if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    else setHasWrongAnswer(true);

    setTreeData((prevTree) => {
      const updatedTree = JSON.parse(JSON.stringify(prevTree));

      const findNode = (node, id) => {
        if (node.id === id) return node;
        if (!node.children) return null;
        for (let child of node.children) {
          const found = findNode(child, id);
          if (found) return found;
        }
        return null;
      };

      const parentNode = findNode(updatedTree, selectedPath[selectedPath.length - 1]);
      if (parentNode) {
        parentNode.children.push({
          id: newNodeId,
          name: `Step ${selectedPath.length + 1}`,
          isChest: isCorrect,
          isFull: isCorrect && correctAnswers + 1 >= 10,
          children: [],
        });
      }
      return updatedTree;
    });

    if (currentQuestionIndex === 9) {
      setGameCompleted(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setQuestions(generateQuestions());
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setHasWrongAnswer(false);
    setGameCompleted(false);
    setTreeData({ id: "root", name: "Start", children: [] });
    setSelectedPath(["root"]);
    setTimerStarted(false);
  };

  return (
    <main className="quiz-container">
      <div className="timer-container">
        <Timer started={timerStarted} completed={gameCompleted} />
      </div>
      <div className="content-container">
        <div className="question-container">
          {questions.length > 0 && (
            <QuestionPanel
              question={questions[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={10}
              correctAnswers={correctAnswers}
              gameCompleted={gameCompleted}
              hasWrongAnswer={hasWrongAnswer}
              onReset={resetGame}
            />
          )}
        </div>
        <div className="tree-container">
          <TreeVisualization treeData={treeData} selectedPath={selectedPath} />
        </div>
      </div>
    </main>
  );
}

export default Quiz;
