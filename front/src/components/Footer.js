import React from 'react';
import '../styles/Footer.css';
import seoultech from '../assets/seoultech.png';
import github from '../assets/github.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a
          href="https://github.com/STAR-ITM-WP/STAR"
          target="_blank"
          rel="noopener noreferrer"
        >
           <img src={github} alt="GitHub" className="footer-icon" />
        </a>
        <a
          href="https://itm.seoultech.ac.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={seoultech} alt="ITM SeoulTech" className="footer-icon" />
        </a>
      </div>

      <p>© 2025 STAR (SeoulTech Available Room)</p>
      <p>
        Created with ❤️ by Team 9 — Shinhyung Park, Yuyoung Hwang, Yeeun Lee
      </p>
      <p>Developed for ITM519 – Web Programming Final Project</p>
    </footer>
  );
};

export default Footer;
