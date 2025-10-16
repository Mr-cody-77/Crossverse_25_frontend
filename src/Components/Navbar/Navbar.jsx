import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google Token:', tokenResponse);
        setIsGoogleAuth(true);
        navigate("/");
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    onError: () => {
      console.log('Google Login Failed');
    }
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">CROSSverse</div>

      <ul className={isOpen ? "nav-links open" : "nav-links"}>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/Rules">Rules</a>
        </li>
        <li>
          <a href="/riddles">Hints</a>
        </li>
        <li>
          <a href="/crossword">CrossWord</a>
        </li>
        <li>
          <a href="/leaderboard">LeaderBoard</a>
        </li>
      </ul>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={isOpen ? "line rotate-top" : "line"}></div>
        <div className={isOpen ? "line hide" : "line"}></div>
        <div className={isOpen ? "line rotate-bottom" : "line"}></div>
      </div>
    </nav>
  );
};

export default Navbar;
