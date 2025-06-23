// Common types used across the application

export interface Payment {
  id: number;
  account_id: number;
  amount: number;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  account_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Account {
  id: number;
  name: string;
  balance: number;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardData {
  summary: {
    totalAccounts: number;
    totalBalance: number;
    totalPayments: number;
    totalCredits: number;
    totalDebits: number;
  };
  recentPayments: Payment[];
  topAccounts: Account[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  account_id?: number;
}

export interface PaymentFormData {
  account_id: number;
  amount: number;
  date: string;
  description: string;
  type: 'credit' | 'debit';
}

export interface AccountFormData {
  name: string;
  balance: number;
} 