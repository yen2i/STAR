import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';
import signpassward from '../assets/signpass.png';
import signstudentnumber from '../assets/signprofile.png';

const LoginPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        studentNumber,
        password
      });
      alert('로그인 성공!');
      console.log(res.data); // 토큰 저장 등
      // localStorage.setItem('token', res.data.token); // 필요 시
    } catch (err) {
      alert(err.response?.data?.message || '로그인 실패');
    }
  };

  const goToSignup = () => {
    window.location.href = '/signup'; // 또는 useNavigate()
  };

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
            <input type="text" placeholder="Student Number" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
          </div>
          <div className="input-wrapper">
            <img src={signpassward} alt="password" className="input-icon" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="login-buttons">
            <button onClick={handleLogin}>Log in</button>
            <button onClick={goToSignup}>Sign in</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
