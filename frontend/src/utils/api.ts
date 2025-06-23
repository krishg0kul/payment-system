import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginationParams, PaymentFormData, AccountFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private client: AxiosInstance;
  private token: string | null;

  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          await this.getToken();
        }
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 403 && this.token) {
          console.log('Token expired, getting fresh token...');
          this.token = null;
          // Retry the original request
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            await this.getToken();
            if (this.token) {
              originalRequest.headers.Authorization = `Bearer ${this.token}`;
            }
            return this.client(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Get a fresh demo token from the backend
  private async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/demo-token`);
      this.token = response.data.data.token;
      
      if (!this.token) {
        throw new Error('No token received from server');
      }
      
      console.log('Demo token obtained successfully');
      return this.token;
    } catch (error: any) {
      console.error('Failed to get demo token:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to authenticate';
      throw new Error(`Authentication failed: ${errorMessage}`);
    }
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      throw new Error(errorMessage);
    }
  }

  // Dashboard API
  async getDashboardSummary(): Promise<ApiResponse<any>> {
    return this.request<any>('GET', '/dashboard/summary');
  }

  // Accounts API
  async getAccounts(params: PaginationParams = {}): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/accounts', undefined, params);
  }

  async getAccount(id: number): Promise<ApiResponse<any>> {
    return this.request<any>('GET', `/accounts/${id}`);
  }

  async getAccountSummary(id: number): Promise<ApiResponse<any>> {
    return this.request<any>('GET', `/accounts/${id}/summary`);
  }

  async createAccount(data: AccountFormData): Promise<ApiResponse<any>> {
    return this.request<any>('POST', '/accounts', data);
  }

  async updateAccount(id: number, data: Partial<AccountFormData>): Promise<ApiResponse<any>> {
    return this.request<any>('PUT', `/accounts/${id}`, data);
  }

  async deleteAccount(id: number): Promise<ApiResponse<any>> {
    return this.request<any>('DELETE', `/accounts/${id}`);
  }

  // Payments API
  async getPayments(params: PaginationParams = {}): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/payments', undefined, params);
  }

  async getPayment(id: number): Promise<ApiResponse<any>> {
    return this.request<any>('GET', `/payments/${id}`);
  }

  async getRecentPayments(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/payments/recent', undefined, { limit });
  }

  async createPayment(data: PaymentFormData): Promise<ApiResponse<any>> {
    return this.request<any>('POST', '/payments', data);
  }

  async updatePayment(id: number, data: Partial<PaymentFormData>): Promise<ApiResponse<any>> {
    return this.request<any>('PUT', `/payments/${id}`, data);
  }

  async deletePayment(id: number): Promise<ApiResponse<any>> {
    return this.request<any>('DELETE', `/payments/${id}`);
  }
}

export const apiService = new ApiService();
export default apiService; 