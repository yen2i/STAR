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
      await axios.post('http://localhost:5000/api/users/register', form);
      alert('회원가입 성공!');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div className="signup-page">
      <Header />
      <main className="signup-content">
        <div className="signup-box">
          <h2 className="signup-label">Sign in</h2>

          <div className="input-wrapper">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>Student Number</label>
            <input
              name="studentNumber"
              type="text"
              placeholder="Student Number"
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <div className="input-wrapper">
            <label>Major</label>
            <input
              name="major"
              type="text"
              placeholder="Major"
              onChange={handleChange}
            />
          </div>

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
