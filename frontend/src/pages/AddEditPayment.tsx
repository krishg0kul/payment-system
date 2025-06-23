import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PaymentForm } from '../forms';
import { PaymentFormData } from '../types';
import apiService from '../utils/api';
import './Dashboard.css'; // Import for page-container styles

const AddEditPayment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPayment(Number(id));
      setPayment(response.data);
    } catch (err) {
      console.error('Error fetching payment:', err);
      alert('Failed to load payment data');
      navigate('/payments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: PaymentFormData) => {
    try {
      if (id) {
        await apiService.updatePayment(Number(id), formData);
        alert('Payment updated successfully');
      } else {
        await apiService.createPayment(formData);
        alert('Payment created successfully');
      }
      navigate('/payments');
    } catch (err) {
      console.error('Error saving payment:', err);
      alert('Failed to save payment');
      throw err;
    }
  };

  const handleCancel = () => {
    navigate('/payments');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 40 }}>
          Loading payment data...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PaymentForm
        payment={payment}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddEditPayment; 