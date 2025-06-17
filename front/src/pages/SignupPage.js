import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    studentNumber: '',
    password: '',
    major: '',
  });

  const [departments, setDepartments] = useState([]);

  // Load department list from JSON
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/departments.json');
        const data = await res.json();
        const deptList = data.map(d => d.department);
        setDepartments(deptList);
      } catch (err) {
        console.error('⚠️ Failed to load department data:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post('https://star-isih.onrender.com/api/users/register', form);
      alert('Sign up successful!');
      window.location.href = '/login';
    } catch (err) {
      if (!err.response) {
        console.error('⚠️ Failed to connect to the server:', err);
        alert('Failed to connect to the server. Please try again later.');
      } else {
        alert(err.response?.data?.message || 'Sign up failed. Please check your input and try again.');
      }
    }
  };

  return (
    <div className="signup-page">
      <Header />
      <main className="signup-content">
        <div className="signup-box">
          <h2 className="signup-label">Sign up</h2>

          {/* Name */}
          <div className="input-wrapper">
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Student Number */}
          <div className="input-wrapper">
            <label>Student Number</label>
            <input
              name="studentNumber"
              type="text"
              placeholder="Enter your student number"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          {/* Major */}
          <div className="input-wrapper">
            <label>Major</label>
            <select name="major" value={form.major} onChange={handleChange} required>
              <option value="">Select your department</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Sign Up Button */}
          <div className="signup-button">
            <button onClick={handleSignup}>Sign up</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
