import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />

      <main className="login-content">
        <h1 className="login-title">
          <span className="highlight">SeoulTech</span> Available Room
        </h1>

        <div className="login-box">
          <h2>⭐ Log In</h2>
          <input type="text" placeholder="Student Number" />
          <input type="password" placeholder="Password" />
          <div className="login-buttons">
            <button>로그인</button>
            <button>회원가입</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
