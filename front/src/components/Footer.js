import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Footer</p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '10px',
    borderTop: '1px solid gray',
    textAlign: 'center',
    marginTop: 'auto',
  },
};

export default Footer;
