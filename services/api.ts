// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://www.adrc.cloudev.org/api'; // Change to your Laravel API URL

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('auth_token');
    console.log('Retrieved token:', token); // Debug log
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    console.log('Making request to:', url, 'with headers:', headers); // Debug log

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      console.log('Request config:', config); // Debug log
      const response = await fetch(url, config);
      const data = await response.json();
      console.log('Response status:', response.status, 'Data:', data); // Debug log

      if (response.status === 401) {
        try {
          await this.refreshToken();
          // Retry the original request with the new token
          const retryHeaders = await this.getAuthHeaders();
          const retryConfig: RequestInit = {
            ...options,
            headers: {
              ...retryHeaders,
              ...options.headers,
            },
          };
          const retryResponse = await fetch(url, retryConfig);
          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            throw new Error(retryData.message || 'Request failed after token refresh');
          }

          return retryData;
        } catch (refreshError) {
          throw new Error('Unauthorized: Please log in again');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.success && response.data.token) {
      console.log('Saving new token:', response.data.token); // Debug log
      await AsyncStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  // Auth Services
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      console.log('Saving token:', response.data.token); // Debug log
      await AsyncStorage.setItem('auth_token', response.data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.token) {
      console.log('Saving token:', response.data.token); // Debug log
      await AsyncStorage.setItem('auth_token', response.data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Reports Services
  async getReports(params?: ReportFilters): Promise<ApiResponse<PaginatedData<Report>>> {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return this.request<ApiResponse<PaginatedData<Report>>>(`/reports${query}`);
  }

  async getReport(id: number): Promise<ApiResponse<Report>> {
    return this.request<ApiResponse<Report>>(`/reports/${id}`);
  }

  async createReport(reportData: CreateReportData): Promise<ApiResponse<Report>> {
    return this.request<ApiResponse<Report>>('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updateReport(id: number, reportData: Partial<CreateReportData>): Promise<ApiResponse<Report>> {
    return this.request<ApiResponse<Report>>(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  async deleteReport(id: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  // Follow/Unfollow Report Services
  async checkReportFollowing(reportId: number): Promise<{ isFollowing: boolean }> {
    return this.request<{ isFollowing: boolean }>(`/reports/${reportId}/follow`, {
      method: 'GET',
    });
  }

  async followReport(reportId: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/reports/${reportId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowReport(reportId: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/reports/${reportId}/follow`, {
      method: 'DELETE',
    });
  }

  // Notifications Services
  async getNotifications(page?: number): Promise<ApiResponse<PaginatedData<Notification>>> {
    const query = page ? `?page=${page}` : '';
    return this.request<ApiResponse<PaginatedData<Notification>>>(`/notifications${query}`);
  }

  async markNotificationAsRead(id: number): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/notifications/read-all', {
      method: 'POST',
    });
  }

  async getUnreadNotificationsCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<ApiResponse<{ count: number }>>('/notifications/unread-count');
  }

  // Chat Services
  async getChatMessages(): Promise<ApiResponse<ChatMessage[]>> {
    return this.request<ApiResponse<ChatMessage[]>>('/chat/messages');
  }

  async sendMessage(message: string): Promise<ApiResponse<ChatMessage>> {
    return this.request<ApiResponse<ChatMessage>>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async markMessagesAsRead(): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>('/chat/messages/read', {
      method: 'POST',
    });
  }

  async getUnreadMessagesCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<ApiResponse<{ count: number }>>('/chat/messages/unread-count');
  }

  async getNotificationsAfter(timestamp: string): Promise<ApiResponse<NotificationModel[]>> {
    const query = `?after=${encodeURIComponent(timestamp)}`;
    return this.request<ApiResponse<NotificationModel[]>>(`/notifications/new${query}`);
  }
}

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  created_at: string;
  read_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refresh_token?: string; // Added for refresh token support
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'blocked';
  last_active_at?: string;
  created_at: string;
  updated_at: string;
  total_reports?: number;
  resolved_reports?: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address?: string;
}

export interface Report {
  id: number;
  type: 'vazamento' | 'falta_agua' | 'pressao_baixa' | 'qualidade_agua';
  type_text: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'pendente' | 'em_andamento' | 'resolvido';
  status_text: string;
  priority: 'baixa' | 'media' | 'alta';
  priority_text: string;
  photos?: string[];
  admin_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateReportData {
  type: 'vazamento' | 'falta_agua' | 'pressao_baixa' | 'qualidade_agua';
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
}

export interface ReportFilters {
  status?: string;
  type?: string;
  page?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  type_text: string;
  created_at: string;
  is_read?: boolean;
  read_at?: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  sender_type: 'user' | 'admin';
  is_read: boolean;
  read_at?: string;
  created_at: string;
  user?: User;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export default new ApiService();