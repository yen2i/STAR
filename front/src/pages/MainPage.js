import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MainPage.css';
import starLogo from '../assets/starlogo.png';

const MainPage = () => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/reserve');
    } else {
      navigate('/login');
    }
  };

  const handleMapClick = () => {
    window.open('https://en.seoultech.ac.kr/about/cmap', '_blank');
  };

  return (
    <div className="main-page">
      <Header />

      <main className="main-content">
        {/* 로고 + 텍스트 묶음 */}
        <div className="logo-box">
          <img src={starLogo} alt="STAR Logo" className="logo-image" />
          <div className="sub-title">
            <span style={{ color: '#D32024' }}>S</span>
            <span>eoul </span>
            <span style={{ color: '#062A50' }}>T</span>
            <span>ech </span>
            <span style={{ color: '#D32024' }}>A</span>
            <span>vailable </span>
            <span style={{ color: '#1E1759' }}>R</span>
            <span>oom</span>
          </div>
        </div>

        {/* 버튼 묶음 */}
        <div className="main-buttons">
          <button onClick={handleBookClick}>Book a Classroom Now →</button>
          <button onClick={handleMapClick}>View Classroom Map →</button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
