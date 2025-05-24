import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    studentNumber: '',
    password: '',
    major: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      // 1. 실제 백엔드로 요청 시도
      await axios.post('http://localhost:5000/api/users/register', form);
      alert('회원가입 성공!');
      window.location.href = '/login';
    } catch (err) {
      // 2. 서버 연결 실패시 -> 로컬 저장
      if (!err.response) {
        console.warn('⚠️ 서버 연결 실패. 로컬에 mock 회원 저장.');
        localStorage.setItem('mockUser', JSON.stringify(form));
        alert('⚠️ 서버 미연결 - 로컬 mock 회원가입 완료');
        window.location.href = '/login';
      } else {
        alert(err.response?.data?.message || '회원가입 실패');
      }
    }
  };

  return (
    <div className="signup-page">
      <Header />
      <main className="signup-content">
        <div className="signup-box">
          <h2 className="signup-label">Sign in</h2>
          {['name', 'studentNumber', 'password', 'major'].map((field) => (
            <div className="input-wrapper" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                type={field === 'password' ? 'password' : 'text'}
                placeholder={field}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="signup-button">
            <button onClick={handleSignup}>Sign in</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
