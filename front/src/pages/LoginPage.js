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
  const [form, setForm] = useState({ studentNumber: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://star-isih.onrender.com/api/users/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/'); // ✅ redirect to main
    } catch (err) {
      console.error('[Login Error]', err);

      if (err.response) {
        if (err.response.status === 400) {
          setErrorMessage('User not found. Please check your student number.');
        } else if (err.response.status === 401) {
          setErrorMessage('Incorrect password. Please try again.');
        } else {
          setErrorMessage('Login failed. Please try again later.');
        }
      } else {
        setErrorMessage('Network error. Please check your internet connection.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}

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
