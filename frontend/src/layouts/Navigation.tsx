import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => (
  <nav className="sidebar-nav">
    <ul>
      <li><NavLink to="/" end>Dashboard</NavLink></li>
      <li><NavLink to="/payments">Payments</NavLink></li>
      <li><NavLink to="/accounts">Accounts</NavLink></li>
    </ul>
  </nav>
);

export default Navigation;
