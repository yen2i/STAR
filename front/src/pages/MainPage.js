import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />

      <main className="main-content">
        <h1 className="main-title">
          <span className="highlight">SeoulTech</span> Available Room
        </h1>

        <div className="main-buttons">
          <button>강의실 예약 바로가기 →</button>
          <button>강의실 지도 보러가기 →</button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
