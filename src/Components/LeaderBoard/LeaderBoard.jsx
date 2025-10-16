"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LeaderBoard.css"; 


const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const backend_url=process.env.REACT_APP_BACKEND;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${backend_url}/api/leaderboard/`);
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.sort((a, b) => a.time - b.time));
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []); 

  return (
    <div className="leaderboard-container mt-10 relative"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/background2.jpg'})` }}>
      <h1 className="text-5xl">Leaderboard</h1>
       <div style={{ overflowX: "auto" }}>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              
              <th>Time</th>
              
            </tr>
            
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id}>
                <td>{index + 1}</td>
                <td>{player.name}</td>
                
                <td>{player.time} ms</td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div> 

      <div className="font-bold text-3xl text-center ">
        {/* Leader Board will be updated soon */}
      </div>
      {/* <Link to="/" className="back-link">Back to Game</Link> */}
    </div>
  );
};

export default Leaderboard;