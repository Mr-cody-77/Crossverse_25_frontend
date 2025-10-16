import React, { useState, useEffect } from "react";
import "./WinnerPage.css";

function WinnerPage() {
  const [passcodeInput, setPasscodeInput] = useState("");
  const [winner, setWinner] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [message, setMessage] = useState("");
  const backend_url = process.env.REACT_APP_BACKEND;

  const correctPasscode = process.env.REACT_APP_PASSCODE;

  // console.log(correctPasscode);

  // Fetch winner from backend when component mounts
  // useEffect(() => {
  //   fetch(`${backend_url}/api/winner/`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.length > 0 && data[0].name) {
  //         setWinner(true);
  //         setWinnerName(data[0].name);
  //         setMessage(`Winner already declared: ${data[0].name}`);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching winner:", error);
  //     });
  // }, []);

  const handleSubmit = () => {
    if (winner) {
      setMessage(`Passcode already claimed by ${winnerName}`);
      return;
    }

    if (passcodeInput === correctPasscode) {
      const winner_name = localStorage.getItem("name");

      // Check if model is empty before posting
      fetch(`${backend_url}/api/winner/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0 && data[0].name) {
            // alert(`Passcode already claimed by ${data[0].name}`);
            setWinner(true);
            setWinnerName(data[0].name);
            setMessage(`Passcode already claimed by ${data[0].name}`);
          } else {
            // Post winner if model is empty
            fetch(`${backend_url}/api/winner/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: winner_name }),
            })
              .then((response) => response.json())
              .then((data) => {
                setWinner(true);
                setWinnerName(data.name);
                setMessage(`Hurray! ${winner_name}, you won!`);
              })
              .catch((error) => {
                console.error("Error saving winner:", error);
                setMessage("Error saving winner. Try again!");
              });
          }
        })
        .catch((error) => {
          console.error("Error checking winner status:", error);
          setMessage("Error checking winner status. Try again!");
        });
    } else {
      setMessage("Incorrect passcode. Try again!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative mt-12">
      <div className="img-container bg-black relative z-10">
        <img src="../../../../TreasurePhotopng1.png" alt="TreasurePhoto" />
        {winner && (
          <div className="winner-overlay text-center">
            <h1 className="winner-text ">{message}</h1>
          </div>
        )}
      </div>
      <div className="row mt-4">
        {message && (
          <div className="message mt-4">
            <p className="text-white ">{message}</p>
          </div>
        )}
        <span>
          <input
            className="gate"
            id="element"
            type="text"
            placeholder="Enter PassCode to Win"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor="element">PassCode</label>
        </span>
        <button className="btn bg-[#377d6a]" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default WinnerPage;
