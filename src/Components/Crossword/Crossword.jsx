"use client";

import { useState, useEffect } from "react";
import "./Crossword.css";
import { useNavigate } from "react-router-dom";

export default function Crossword() {
  const navigate=useNavigate();
  // Update the crosswordData object with a larger grid containing 10 words
  const crosswordData = {
    grid: [
      ["", "", "", "", "J", "", "", "", "", "", ""],
      ["", "", "", "", "A", "", "R", "E", "A", "C", "T"],
      ["", "", "", "", "V", "", "", "", "", "", ""],
      ["", "", "N", "O", "A", "P", "I", "", "", "", ""],
      ["", "", "O", "", "S", "", "", "", "", "", ""],
      ["", "A", "D", "", "C", "O", "D", "E", "", "", ""],
      ["", "L", "E", "", "R", "", "", "", "", "", ""],
      ["H", "U", "", "", "I", "", "", "", "", "", ""],
      ["T", "M", "P", "O", "P", "", "", "", "", "", ""],
      ["M", "N", "", "", "T", "", "", "", "", "", ""],
      ["L", "I", "B", "R", "A", "R", "Y", "", "", "", ""],
    ],
    // Solution grid for checking answers
    solution: [
      ["", "", "", "", "J", "", "", "", "", "", ""],
      ["", "", "", "", "A", "", "R", "E", "A", "C", "T"],
      ["", "", "", "", "V", "", "", "", "", "", ""],
      ["", "", "N", "O", "A", "P", "I", "", "", "", ""],
      ["", "", "O", "", "S", "", "", "", "", "", ""],
      ["", "A", "D", "", "C", "O", "D", "E", "", "", ""],
      ["", "L", "E", "", "R", "", "", "", "", "", ""],
      ["H", "U", "", "", "I", "", "", "", "", "", ""],
      ["T", "M", "P", "O", "P", "", "", "", "", "", ""],
      ["M", "N", "", "", "T", "", "", "", "", "", ""],
      ["L", "I", "B", "R", "A", "R", "Y", "", "", "", ""],
    ],
    // Add clues for the words (not displayed in this version)
    words: [
      {
        id: 1,
        word: "JAVASCRIPT",
        direction: "vertical",
        startRow: 0,
        startCol: 4,
      },
      {
        id: 2,
        word: "REACT",
        direction: "horizontal",
        startRow: 1,
        startCol: 6,
      },
      {
        id: 3,
        word: "NOAPI",
        direction: "horizontal",
        startRow: 3,
        startCol: 2,
      },
      { id: 4, word: "NODE", direction: "vertical", startRow: 3, startCol: 2 },
      {
        id: 5,
        word: "CODE",
        direction: "horizontal",
        startRow: 5,
        startCol: 4,
      },
      {
        id: 6,
        word: "ALUMNI",
        direction: "vertical",
        startRow: 5,
        startCol: 1,
      },
      { id: 7, word: "HTML", direction: "vertical", startRow: 7, startCol: 0 },
      { id: 8, word: "POP", direction: "horizontal", startRow: 8, startCol: 2 },
      {
        id: 9,
        word: "SCRIPT",
        direction: "vertical",
        startRow: 4,
        startCol: 4,
      },
      {
        id: 10,
        word: "LIBRARY",
        direction: "horizontal",
        startRow: 10,
        startCol: 0,
      },
    ],
  };

  // State for user input grid and popup
  const [userGrid, setUserGrid] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 });
  const [cellNumbers, setCellNumbers] = useState({});

  // Initialize the user grid with empty values where the solution has values
  // and determine which cells need numbers
  useEffect(() => {
    const initialGrid = crosswordData.grid.map((row) =>
      row.map((cell) => (cell !== "" ? "" : null))
    );
    setUserGrid(initialGrid);

    // Create a map of cell numbers for start of words
    // Create a map of cell numbers for start of words
const numbers = {};
crosswordData.words.forEach((word) => {
  const key = `${word.startRow}-${word.startCol}`;
  if (numbers[key]) {
    // If a number already exists, combine them
    numbers[key] = Array.isArray(numbers[key])
      ? [...numbers[key], word.id]
      : [numbers[key], word.id];
  } else {
    numbers[key] = word.id;
  }
});
setCellNumbers(numbers);

  }, []);

  // Handle cell input change
  const handleCellChange = (row, col, value) => {
    if (crosswordData.grid[row][col] === "") return;

    const newGrid = [...userGrid];
    newGrid[row][col] = value.toUpperCase();
    setUserGrid(newGrid);

    // Auto-move to next cell if this is a single letter
    if (value.length === 1) {
      moveToNextCell(row, col);
    }
  };

  // Move to the next available cell
  const moveToNextCell = (row, col) => {
    // Try to move right
    if (
      col + 1 < crosswordData.grid[0].length &&
      crosswordData.grid[row][col + 1] !== ""
    ) {
      setSelectedCell({ row, col: col + 1 });
      return;
    }

    // Try to move down
    if (
      row + 1 < crosswordData.grid.length &&
      crosswordData.grid[row + 1][col] !== ""
    ) {
      setSelectedCell({ row: row + 1, col });
      return;
    }

    // Find the next available cell
    for (let r = 0; r < crosswordData.grid.length; r++) {
      for (let c = 0; c < crosswordData.grid[r].length; c++) {
        if (userGrid[r][c] === "" && crosswordData.grid[r][c] !== "") {
          setSelectedCell({ row: r, col: c });
          return;
        }
      }
    }
  };

  // Handle cell selection
  const handleCellClick = (row, col) => {
    if (crosswordData.grid[row][col] !== "") {
      setSelectedCell({ row, col });
    }
  };

  // Handle key press for navigation
  const handleKeyDown = (e, row, col) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveToNextAvailableCell(row, col, 0, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveToNextAvailableCell(row, col, 0, -1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveToNextAvailableCell(row, col, 1, 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveToNextAvailableCell(row, col, -1, 0);
    }
  };

  // Move to the next available cell in the specified direction
  const moveToNextAvailableCell = (row, col, rowDelta, colDelta) => {
    let newRow = row + rowDelta;
    let newCol = col + colDelta;

    while (
      newRow >= 0 &&
      newRow < crosswordData.grid.length &&
      newCol >= 0 &&
      newCol < crosswordData.grid[0].length
    ) {
      if (crosswordData.grid[newRow][newCol] !== "") {
        setSelectedCell({ row: newRow, col: newCol });
        return;
      }
      newRow += rowDelta;
      newCol += colDelta;
    }
  };

  // Check if the user's answers are correct
  const checkAnswers = () => {
    let correct = true;

    for (let row = 0; row < crosswordData.solution.length; row++) {
      for (let col = 0; col < crosswordData.solution[row].length; col++) {
        if (
          crosswordData.solution[row][col] !== "" &&
          userGrid[row][col] !== crosswordData.solution[row][col]
        ) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }

    setIsCorrect(correct);
    setShowPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Check if cell has a number
  const getCellNumber = (row, col) => {
    const key = `${row}-${col}`;
    return cellNumbers[key] || null;
  };
  const moveAhead = async () => {
    const backend_url = process.env.REACT_APP_BACKEND;
    const player_name = localStorage.getItem("name");
    const start_time = Number(localStorage.getItem("start_time")) || Date.now();

    try {
      // Step 1: Fetch current leaderboard data
      const res = await fetch(`${backend_url}/api/leaderboard/`);
      const data = await res.json();

      // Step 2: Check if player already exists
      const existingPlayer = data.find((p) => p.name === player_name);

      const elapsedTime = Date.now() - start_time;

      if (existingPlayer) {
        // Step 3: Update their time if they already exist
        await fetch(`${backend_url}/api/leaderboard/${existingPlayer.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time: elapsedTime }),
        });
        console.log("Existing player time updated");
      } else {
        // Step 4: Add new player if not present
        await fetch(`${backend_url}/api/leaderboard/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: player_name, time: elapsedTime }),
        });
        console.log("New player added to leaderboard");
      }

      // Step 5: Navigate to winner page
      navigate("/winner");
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      alert("Something went wrong while updating leaderboard.");
    }
  };


  // Render the crossword grid
  return (
    <div className="crossword-container">
      <h1 id="crossword-heading">Crossword Puzzle</h1>

      <div className="crossword-grid text-black ">
        {userGrid.map((row, rowIndex) => (
          <div key={"row-" + rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={"cell-" + rowIndex + "-" + colIndex}
                className={`grid-cell ${cell === null ? "blocked" : ""} ${
                  selectedCell.row === rowIndex && selectedCell.col === colIndex
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell !== null && (
                  <>
                    {(() => {
  const num = getCellNumber(rowIndex, colIndex);
  if (!num) return null;

  const nums = Array.isArray(num) ? num : [num];
  const directions = crosswordData.words
    .filter(w => nums.includes(w.id))
    .map(w => (w.direction === "horizontal" ? "↔" : "↕"));

  return (
    <>
      <span className="cell-number">{nums.join(",")}</span>
      <span className="cell-direction">{directions.join("")}</span>
    </>
  );
})()}


                    <input
                      type="text"
                      maxLength="1"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                      ref={(input) => {
                        if (
                          input &&
                          selectedCell.row === rowIndex &&
                          selectedCell.col === colIndex
                        ) {
                          input.focus();
                        }
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="relative cross-submit-button" onClick={checkAnswers}>
        Submit Answers
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{isCorrect ? "Congratulations!" : "Try Again!"}</h2>
            <p className="text-black ">
              {isCorrect ? (
                <>
                  All your answers are correct! <br />
                  <span className="font-semibold text-blue-700">PassCode: {process.env.REACT_APP_PASSCODE}</span>
                </>
              ) : (
                "Some of your answers are incorrect. Please try again."
              )}
            </p>

            <button onClick={isCorrect ? moveAhead : closePopup}>
              {isCorrect ? "Move Ahead" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}