import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
      <a href="https://github.com/STAR-ITM-WP/STAR" target="_blank" rel="noopener noreferrer" style={{ marginRight: '20px' }}>
          GitHub 
        </a>
        <a href="https://itm.seoultech.ac.kr/" target="_blank" rel="noopener noreferrer">
          ITM, SeoulTech
        </a>
      </p>
      <p>© 2025 STAR (SeoulTech Available Room)</p>
      <p>
      Created with ❤️ by Team STAR — Shinhyung Park, Yuyoung Hwang, Yeeun Lee
      </p>
      <p>Developed for ITM519 – Web Programming Final Project</p>
    </footer>
  );
};

export default Footer;
