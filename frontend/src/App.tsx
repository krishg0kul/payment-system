import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components';
import Navigation from './layouts/Navigation';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Accounts from './pages/Accounts';
import AddEditPayment from './pages/AddEditPayment';
import AddEditAccount from './pages/AddEditAccount';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-content">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/payments/add" element={<AddEditPayment />} />
            <Route path="/payments/edit/:id" element={<AddEditPayment />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/add" element={<AddEditAccount />} />
            <Route path="/accounts/edit/:id" element={<AddEditAccount />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
