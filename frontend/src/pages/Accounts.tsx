import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { setAccounts, setLoading, setError } from '../store/accountsSlice';
import { Table, Column } from '../components';
import { Account } from '../types';
import apiService from '../utils/api';

const Accounts: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: accounts, loading, error } = useSelector((state: RootState) => state.accounts);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAccounts();
  }, [page, pageSize, searchTerm]);

  const fetchAccounts = async () => {
    try {
      dispatch(setLoading(true));
      const response = await apiService.getAccounts({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
      });
      
      dispatch(setAccounts(response.data as Account[]));
      setTotal(response.pagination?.total || 0);
      dispatch(setError(null));
    } catch (err) {
      dispatch(setError('Failed to fetch accounts'));
      console.error('Fetch accounts error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (account: Account) => {
    navigate(`/accounts/edit/${account.id}`);
  };

  const handleDelete = async (account: Account) => {
    if (window.confirm(`Are you sure you want to delete the account "${account.name}"? This will also delete all associated payments.`)) {
      try {
        await apiService.deleteAccount(account.id);
        fetchAccounts(); // Refresh the list
        alert('Account deleted successfully');
      } catch (err) {
        alert('Failed to delete account');
        console.error('Delete account error:', err);
      }
    }
  };

  const columns: Column<Account>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => `#${value}`,
    },
    {
      key: 'name',
      label: 'Account Name',
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value) => (
        <span style={{ 
          fontWeight: 'bold',
          color: parseFloat(value) >= 0 ? '#27ae60' : '#e74c3c',
        }}>
          ${parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A',
    },
  ];

  if (loading && accounts.length === 0) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: 40 }}>Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Accounts</h2>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={() => navigate('/accounts/add')}
        >
          Add Account
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
        data={accounts}
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

export default Accounts; 