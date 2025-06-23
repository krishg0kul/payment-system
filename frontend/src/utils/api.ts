import { ApiResponse, PaginationParams, PaymentFormData, AccountFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Get a fresh demo token from the backend
  private async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/demo-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get demo token');
      }

      const data = await response.json();
      this.token = data.data.token;
      
      if (!this.token) {
        throw new Error('No token received from server');
      }
      
      console.log('Demo token obtained successfully');
      return this.token;
    } catch (error) {
      console.error('Failed to get demo token:', error);
      throw new Error('Authentication failed');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get fresh token
    const token = await this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, clear it and retry once
        if (response.status === 403 && this.token) {
          console.log('🔄 Token expired, getting fresh token...');
          this.token = null;
          return this.request(endpoint, options); // Retry with fresh token
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard API
  async getDashboardSummary(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/summary');
  }

  // Accounts API
  async getAccounts(params: PaginationParams = {}): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return this.request<any[]>(`/accounts${queryString ? `?${queryString}` : ''}`);
  }

  async getAccount(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/accounts/${id}`);
  }

  async getAccountSummary(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/accounts/${id}/summary`);
  }

  async createAccount(data: AccountFormData): Promise<ApiResponse<any>> {
    return this.request<any>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(id: number, data: Partial<AccountFormData>): Promise<ApiResponse<any>> {
    return this.request<any>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments API
  async getPayments(params: PaginationParams = {}): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return this.request<any[]>(`/payments${queryString ? `?${queryString}` : ''}`);
  }

  async getPayment(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${id}`);
  }

  async getRecentPayments(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/payments/recent?limit=${limit}`);
  }

  async createPayment(data: PaymentFormData): Promise<ApiResponse<any>> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayment(id: number, data: Partial<PaymentFormData>): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePayment(id: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService; 