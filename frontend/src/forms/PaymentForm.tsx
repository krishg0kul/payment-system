import React, { useState, useEffect } from 'react';
import { PaymentFormData, Account } from '../types';
import apiService from '../utils/api';
import './Form.css';

interface PaymentFormProps {
  payment?: any;
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    account_id: payment?.account_id || 0,
    amount: payment?.amount || 0,
    date: payment?.date ? payment.date.split('T')[0] : new Date().toISOString().split('T')[0],
    description: payment?.description || '',
    type: payment?.type || 'debit',
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await apiService.getAccounts({ limit: 100 });
      setAccounts(response.data as Account[]);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_id) {
      newErrors.account_id = 'Please select an account';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'account_id' ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{payment ? 'Edit Payment' : 'Add New Payment'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="account_id">Account *</label>
          <select
            id="account_id"
            name="account_id"
            value={formData.account_id}
            onChange={handleChange}
            className={errors.account_id ? 'error' : ''}
          >
            <option value={0}>Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} (${Number(account.balance).toFixed(2)})
              </option>
            ))}
          </select>
          {errors.account_id && <span className="error-message">{errors.account_id}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="debit">Debit</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? 'error' : ''}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={errors.description ? 'error' : ''}
            placeholder="Enter payment description..."
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : payment ? 'Update Payment' : 'Create Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 