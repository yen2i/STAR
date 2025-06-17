import React, { useState } from 'react';
import api from '../api/instance';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LoginPage.css';
import signpassward from '../assets/signpass.png';
import signstudentnumber from '../assets/signprofile.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentNumber: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    try {
      const res = await api.post('/users/login', form);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/');
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      console.error('🔴 로그인 실패:', err);

      if (err.response?.status === 401) {
        setError('잘못된 학번 또는 비밀번호입니다.');
      } else if (err.response?.status === 400) {
        setError('입력값이 유효하지 않습니다.');
      } else {
        setError('서버 연결에 실패했습니다. Mock 로그인으로 우회합니다.');

        // ⚠️ mock 로그인 fallback
        const mockUser = {
          name: '테스트유저',
          studentNumber: form.studentNumber || '23100000',
          major: 'ITM',
          favorites: ['프론티어관', '다산관'],
        };

        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-content">
        <div className="login-title-wrapper">
          <h1 className="login-title">
            <span className="r">S</span>eoul{' '}
            <span className="b">T</span>ech{' '}
            <span className="g">A</span>vailable{' '}
            <span className="g">R</span>oom
          </h1>
        </div>

        <form className="login-box" onSubmit={handleSubmit}>
          <h2 className="login-label">Log in</h2>

          <div className="login-input-wrapper">
            <img src={signstudentnumber} alt="student number" className="input-icon" />
            <input
              name="studentNumber"
              type="text"
              placeholder="Student Number"
              onChange={handleChange}
              value={form.studentNumber}
              required
            />
          </div>

          <div className="login-input-wrapper">
            <img src={signpassward} alt="password" className="input-icon" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-buttons">
            <button type="submit">Log in</button>
            <button type="button" onClick={() => navigate('/signup')}>Sign in</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
