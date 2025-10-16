import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, 
  faXTwitter, 
  faYoutube, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer 
      className="py-10 bg-[#0d1117] text-white" 
      role="contentinfo" 
      itemScope 
      itemType="http://schema.org/WPFooter"
    >
      {/* Social Navigation */}
      <div 
        className="social text-center pb-[25px]" 
        role="navigation" 
        aria-labelledby="social-heading"
      >
        <h3 id="social-heading" className="sr-only">Follow us on social media</h3>
        <a 
          href="https://www.facebook.com/SAENITD/" 
          aria-label="Facebook" 
          className="text-2xl w-10 h-10 inline-block text-center rounded-full border border-gray-300 mx-2 opacity-75 hover:opacity-90 leading-10"
        >
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a 
          href="https://x.com/saeindia_nitdgp" 
          aria-label="Twitter" 
          className="text-2xl w-10 h-10 inline-block text-center rounded-full border border-gray-300 mx-2 opacity-75 hover:opacity-90 leading-10"
        >
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <a 
          href="https://www.youtube.com/@saenitdgp" 
          aria-label="Mastodon" 
          className="text-2xl w-10 h-10 inline-block text-center rounded-full border border-gray-300 mx-2 opacity-75 hover:opacity-90 leading-10"
        >
          <FontAwesomeIcon icon={faYoutube} />
        </a>
        <a 
          href="https://www.instagram.com/sae.nitd/" 
          aria-label="Instagram" 
          className="text-2xl w-10 h-10 inline-block text-center rounded-full border border-gray-300 mx-2 opacity-75 hover:opacity-90 leading-10"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>

      {/* Horizontal Rule */}
      <hr className="h-[2px] border-0 bg-white" />

      {/* Footer Navigation Links */}
      <ul 
        className="p-0 list-none text-center text-lg leading-[1.6] mb-0 footer-links relative" 
        role="navigation" 
        aria-labelledby="footer-links-heading"
      >
        <h3 id="footer-links-heading" className="sr-only">Footer Links</h3>
        <li className="inline-block px-[10px]">
          <a href="/Intro" className="no-underline opacity-80 hover:opacity-100  hover:text-red-700">
            Intro
          </a>
        </li>
        <li className="inline-block px-[10px]">
          <a href="/Rules" className="no-underline opacity-80 hover:opacity-100  hover:text-red-700">
            Rules
          </a>
        </li>
        <li className="inline-block px-[10px]">
          <a href="/riddles" className="no-underline opacity-80 hover:opacity-100  hover:text-red-700">
            Hints
          </a>
        </li>
        <li className="inline-block px-[10px]">
          <a href="/crossword" className="no-underline opacity-80 hover:opacity-100  hover:text-red-700">
            CrossWord
          </a>
        </li>
        <li className="inline-block px-[10px]">
          <a href="/leaderboard" className="no-underline opacity-80 hover:opacity-100  hover:text-red-700">
            LeaderBoard
          </a>
        </li>
      </ul>

      {/* Copyright */}
      <p className="mt-[15px] text-center text-[20px] text-gray-400 mb-0 copyright relative">
        © 2025{" "}
        <a 
          href="https://saenitd.in/" 
        
        >
          SAE
        </a>. Made with ❤️ by <span   className="text-inherit" 
          style={{ color: "red", fontWeight: "lighter" }}>SAE-WEBD</span> Team.
      </p>
    </footer>
  );
};

export default Footer;
