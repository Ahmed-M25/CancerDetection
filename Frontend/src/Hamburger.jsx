import React, { useState } from 'react';
import Search from './Search';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleMenu} style={styles.hamburgerButton}>
        &#9776;
      </button>
      <div style={{ ...styles.sidebar, transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={toggleMenu} style={styles.closeButton}>&times;</button>
        <Search />
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  hamburgerButton: {
    position: 'fixed',
    top: '10px',
    left: '10px',
    fontSize: '24px',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: '1001',
  },
  sidebar: {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '300px',
    height: '100%',
    backgroundColor: '#343a40',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    transition: 'transform 0.3s ease',
    zIndex: '1000',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Sidebar;
