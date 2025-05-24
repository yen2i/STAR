import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/starlogo_bgX.png';
import '../styles/Header.css'; // CSS 분리 후 import

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="header">
      <img
        src={logo}
        alt="STAR Logo"
        className="logo"
        onClick={() => navigate('/')}
      />
      <nav className="nav">
        {token && user ? (
          <>
            <span className="link" onClick={() => navigate('/profile')}>My Page</span>
            <span className="link" onClick={() => navigate('/my-reservation')}>My Reservation</span>
            <span className="link" onClick={handleLogout}>Log Out</span>
          </>
        ) : (
          <>
            <span className="link" onClick={() => navigate('/login')}>Log In</span>
            <span className="link" onClick={() => navigate('/signup')}>Sign In</span>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
