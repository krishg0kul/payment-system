import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Payment System</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, Demo User</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 