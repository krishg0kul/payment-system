import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setPayments, setLoading, setError } from '../store/paymentsSlice';
import { Table, Column } from '../components';
import { Payment, Account } from '../types';
import apiService from '../utils/api';
import './Dashboard.css'; // Import for page-container styles

const Payments: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: payments, loading, error } = useSelector((state: RootState) => state.payments);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    fetchPayments();
    fetchAccounts();
  }, [page, pageSize, searchTerm]);

  const fetchPayments = async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.getPayments({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
      });
      
      dispatch(setPayments(response.data as Payment[]));
      setTotal(response.pagination?.total || 0);
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError('Failed to fetch payments'));
      console.error('Fetch payments error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await apiService.getAccounts({ limit: 100 });
      setAccounts(response.data as any[]);
    } catch (err) {
      console.error('Fetch accounts error:', err);
    }
  };

  const handleEdit = (payment: Payment) => {
    navigate(`/payments/edit/${payment.id}`);
  };

  const handleDelete = async (payment: Payment) => {
    if (window.confirm(`Are you sure you want to delete the payment "${payment.description}"?`)) {
      try {
        await apiService.deletePayment(payment.id);
        fetchPayments(); // Refresh the list
        alert('Payment deleted successfully');
      } catch (err) {
        alert('Failed to delete payment');
        console.error('Delete payment error:', err);
      }
    }
  };

  const columns: Column<Payment>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`,
    },
    {
      key: 'account_name',
      label: 'Account',
      render: (value) => value || 'Unknown Account',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value, row) => (
        <span style={{ 
          color: row.type === 'credit' ? '#27ae60' : '#e74c3c',
          fontWeight: 'bold' 
        }}>
          {row.type === 'credit' ? '+' : '-'}${parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <span style={{ 
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          backgroundColor: value === 'credit' ? '#d4edda' : '#f8d7da',
          color: value === 'credit' ? '#155724' : '#721c24',
        }}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  if (loading && payments.length === 0) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 40 }}>Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Payments</h2>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/payments/add')}
        >
          Add Payment
        </button>
      </div>

      {error && (
        <div style={{
          padding: 15,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: 4,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      <Table
        columns={columns}
        data={payments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        searchTerm={searchTerm}
        onSearch={(term) => {
          setSearchTerm(term);
          setPage(1);
        }}
      />
    </div>
  );
};

export default Payments; 