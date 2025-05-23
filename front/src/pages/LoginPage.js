import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';
import signpassward from '../assets/signpass.png';
import signstudentnumber from '../assets/signprofile.png';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Header />

      <main className="login-content">
        <div className="login-title-wrapper">
          <h1 className="login-title">
            <span className="highlight">SeoulTech</span> Available Room
          </h1>
        </div>

        <div className="login-box">
          <h2 className="login-label">Log in</h2>
          <div className="input-wrapper">
            <img src={signstudentnumber} alt="student number" className="input-icon" />
            <input type="text" placeholder="Student Number" />
          </div>
          <div className="input-wrapper">
            <img src={signpassward } alt="password" className="input-icon" />
            <input type="password" placeholder="Password" />
          </div>
          <div className="login-buttons">
            <button>Log in</button>
            <button>Sign in</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
