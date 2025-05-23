import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>STAR</div>
      <nav style={styles.nav}>
        <span style={styles.link}>LOG IN</span>
        <span style={styles.link}>회원가입</span>
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
  },
  logo: {
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '12px',
  },
  link: {
    cursor: 'pointer',
  },
};

export default Header;
