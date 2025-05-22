import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>Footer 입니다잇</p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '16px',
    borderTop: '1px solid gray',
    textAlign: 'center',
    marginTop: 'auto',
  },
};

export default Footer;
