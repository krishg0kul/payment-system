import React, { useEffect, useState } from 'react';
import { DashboardData } from '../types';
import apiService from '../utils/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardSummary();
        setDashboardData(response.data as DashboardData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="page-container">
        <div>No data available</div>
      </div>
    );
  }

  const { summary, recentPayments, topAccounts } = dashboardData;

  return (
    <div className="page-container">
      <h2>Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="dashboard-container">

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Accounts</h3>
            <div className="dashboard-value">{summary.totalAccounts}</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Total Balance</h3>
            <div className="dashboard-value">${Number(summary.totalBalance).toFixed(2)}</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Total Payments</h3>
            <div className="dashboard-value">{summary.totalPayments}</div>
          </div>
          
          <div className="dashboard-card">
            <h3>Credits vs Debits</h3>
            <div className="dashboard-value">
              <div style={{ color: 'green' }}>+${Number(summary.totalCredits).toFixed(2)}</div>
              <div style={{ color: 'red' }}>-${Number(summary.totalDebits).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h3>Recent Payments</h3>
          {recentPayments.length > 0 ? (
            <div className="recent-payments">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-info">
                    <div className="payment-description">{payment.description}</div>
                    <div className="payment-account">{payment.account_name}</div>
                  </div>
                  <div className={`payment-amount ${payment.type}`}>
                    {payment.type === 'credit' ? '+' : '-'}${Number(payment.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No recent payments</div>
          )}
        </div>

        {/* Top Accounts */}
        <div className="dashboard-section">
          <h3>Top Accounts by Balance</h3>
          {topAccounts.length > 0 ? (
            <div className="top-accounts">
              {topAccounts.map((account) => (
                <div key={account.id} className="account-item">
                  <div className="account-name">{account.name}</div>
                  <div className={`account-balance ${Number(account.balance) < 0 ? 'negative' : ''}`}>
                    ${Number(account.balance).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No accounts available</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard; 