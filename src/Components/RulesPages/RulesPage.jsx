import React from "react";
import "./RulesPage.css";
import { useNavigate } from "react-router-dom";

const RulesPage = () => {
    const navigator = useNavigate();

    const handleOnclick = () => {
        navigator("/adventure");
    }
  return (
    <div className="rulespg mt-16 ">
      <div className="rules-container relative">
        <h1 className="rules-h1">Rules and Regulation</h1>

        <section className="rules-round">
          <h2 className="rules-h2">Round 1: Quiz Round</h2>
          <p className="rules-para">
            Participants need to{" "}
            <span className="rules-highlight">
              answer correctly 10 questions
            </span>{" "}
            to qualify to the second round. If a participant{" "}
            <span className="rules-highlight">
              fails to answer atleast 10 questions correctly,
            </span>{" "}
            they will be eliminated from the competition.
          </p>
          <ul className="rules-list">
            <li>
              The quiz consists of{" "}
              <span className="rules-highlight">50 questions</span> presented
              one at a time.{" "}
            </li>
            <li>
              Participants <span className="rules-highlight">cannot skip</span>{" "}
              questions or return to previous ones.
            </li>
            <li>
              Each correct answer counts as{" "}
              <span className="rules-highlight">one point. </span>
            </li>
            <li>
              <span className="rules-highlight">
                Incorrect answers or unanswered
              </span>{" "}
              questions will{" "}
              <span className="rules-highlight">not earn points.</span>
            </li>
            <li>
              <span className="rules-highlight">
                Unanswered questions will be marked incorrect
              </span>{" "}
              and would result in disqualification.{" "}
            </li>
            <li>
              <span className="rules-highlight">Scores and rank</span> will be
              calculated automatically and displayed in the{" "}
              <span className="rules-highlight">leaderboard</span>.
            </li>
            <li>
              Only <span className="rules-highlight">one player account</span> can be created per device to avoid multiple entries form single user.
              {" "}
              
            </li>
          </ul>
        </section>

        <section className="rule-round">
          <h2 className="rules-h2">Round 2: Riddle Round</h2>
          <p className="rules-para">
            Participants must solve{" "}
            <span className="rules-highlight">10 riddles</span> by finding and
            scanning the correct{" "}
            <span className="rules-highlight">
              QR codes hidden in the arena.
            </span>{" "}
            Each scanned QR code reveals a word that fits into the crossword
            puzzle. Upon completing the crossword, a final code will be
            generated, which must be entered to win
          </p>
          <ul className="rules-list">
            <li>
              Each participant will receive{" "}
              <span className="rules-highlight">10 riddles</span> at the start
              of the round.
            </li>
            <li>
              The answer to each riddle corresponds to a{" "}
              <span className="rules-highlight">
                QR code hidden within the arena
              </span>
              .
            </li>
            <li>
              Participants must locate and{" "}
              <span className="rules-highlight">scan the correct QR code</span>{" "}
              to unlock the answer.
            </li>
            <li>
              The answers obtained from QR codes must be placed in the provided{" "}
              <span className="rules-highlight">crossword grid</span>.
            </li>
            <li>
              The crossword must be{" "}
              <span className="rules-highlight">fully completed</span> to
              generate the <span className="rules-highlight">final code</span>.
            </li>
            <li>
              The participant must{" "}
              <span className="rules-highlight">enter this final code</span>
            </li>
            <li>
              The <span className="rules-highlight">first 10 participants</span>{" "}
              to enter the correct passcode would be the{" "}
              <span className="rules-highlight-bold">WINNER!</span>.
            </li>
          </ul>
        </section>

        <p className="rules-final-note rules-para">
          Think fast, scan smart, and may the best solver win!
        </p>

        {/* <button onClick={handleOnclick} className="rules-btn">Start Quiz</button> */}
      </div>
    </div>
  );
};

export default RulesPage;
