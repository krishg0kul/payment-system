import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountForm } from '../forms';
import { AccountFormData } from '../types';
import apiService from '../utils/api';
import './Dashboard.css'; // Import for page-container styles

const AddEditAccount: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      fetchAccount();
    }
  }, [id]);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAccount(Number(id));
      setAccount(response.data);
    } catch (err) {
      console.error('Error fetching account:', err);
      alert('Failed to load account data');
      navigate('/accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: AccountFormData) => {
    try {
      if (id) {
        await apiService.updateAccount(Number(id), formData);
        alert('Account updated successfully');
      } else {
        await apiService.createAccount(formData);
        alert('Account created successfully');
      }
      navigate('/accounts');
    } catch (err) {
      console.error('Error saving account:', err);
      alert('Failed to save account');
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/accounts');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 40 }}>
          Loading account data...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AccountForm
        account={account}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddEditAccount; 