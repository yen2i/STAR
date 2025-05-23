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
      const res = await axios.post('http://localhost:5000/api/users/register', form);
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
        <h2>회원가입</h2>
        <div className="signup-box">
          <input name="name" type="text" placeholder="Name" onChange={handleChange} />
          <input name="studentNumber" type="text" placeholder="Student Number" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          <select name="major" onChange={handleChange}>
            <option value="">Select Major</option>
            <option value="ITM">ITM</option>
            <option value="산업공학과">산업공학과</option>
            <option value="컴공">컴퓨터공학과</option>
          </select>
          <button onClick={handleSignup}>가입하기</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
