import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';
import signpassward from '../assets/signpass.png';
import signstudentnumber from '../assets/signprofile.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentNumber: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      
      // 토큰 저장 (필요 시 localStorage 사용)
      localStorage.setItem('token', res.data.token);

      // 🔁 로그인 성공 시 profile로 이동
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || '로그인 실패');
    }
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
            <input
              type="text"
              placeholder="Student Number"
              name="studentNumber"
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <img src={signpassward} alt="password" className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div className="login-buttons">
            <button onClick={handleLogin}>Log in</button>
            <button onClick={() => navigate('/signup')}>Sign in</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
