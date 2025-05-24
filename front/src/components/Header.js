import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/starlogo_bgX.png'; // 이미지 경로 확인

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
    <header style={styles.header}>
      <img
        src={logo}
        alt="STAR Logo"
        style={styles.logo}
        onClick={() => navigate('/')}
      />
      <nav style={styles.nav}>
        {token && user ? (
          <>
            <span style={styles.link} onClick={() => navigate('/profile')}>My Page</span>
            <span style={styles.link} onClick={() => navigate('/my-reservation')}>My Reservation</span>
            <span style={styles.link} onClick={handleLogout}>Log Out</span>
          </>
        ) : (
          <>
            <span style={styles.link} onClick={() => navigate('/login')}>Log In</span>
            <span style={styles.link} onClick={() => navigate('/signup')}>Sign In</span>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: '16px',
    borderBottom: '1px solid gray',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E3E3E3',
    boxShadow: '0px 4px 10px 5px rgba(215, 215, 215, 0.25)',
  },
  logo: {
    height: '128px',
    width: '214px',
    cursor: 'pointer',
  },
  nav: {
    display: 'flex',
    gap: '103px',
    marginRight: '122px', 
  },
  link: {
    cursor: 'pointer',
    color: '#000',
    fontFamily: 'Inter',
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'auto',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
  },
};

export default Header;
