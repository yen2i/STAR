import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SignupPage.css';

const SignupPage = () => {
  return (
    <div className="signup-page">
      <Header />

      <main className="signup-content">
        <h2>회원가입</h2>
        <div className="signup-box">
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Student Number" />
          <input type="password" placeholder="Password" />
          <select>
            <option value="">Select Major</option>
            <option value="ITM">ITM</option>
            <option value="산업공학과">산업공학과</option>
            <option value="컴공">컴퓨터공학과</option>
          </select>
          <button>가입하기</button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
