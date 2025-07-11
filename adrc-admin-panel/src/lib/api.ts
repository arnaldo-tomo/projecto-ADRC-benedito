import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adrc_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adrc_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Funções específicas da API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
};

export const occurrencesAPI = {
  getAll: (filters?: any) => api.get('/occurrences', { params: filters }),
  
  getById: (id: string) => api.get(`/occurrences/${id}`),
  
  updateStatus: (id: string, status: string, notes?: string) =>
    api.patch(`/occurrences/${id}/status`, { status, notes }),
  
  assign: (id: string, technicianId: string) =>
    api.patch(`/occurrences/${id}/assign`, { technicianId }),
  
  getStats: () => api.get('/occurrences/stats'),
};

export const messagesAPI = {
  getByOccurrence: (occurrenceId: string) =>
    api.get(`/messages/occurrence/${occurrenceId}`),
  
  send: (occurrenceId: string, content: string) =>
    api.post('/messages', { occurrenceId, content }),
  
  markAsRead: (messageId: string) =>
    api.patch(`/messages/${messageId}/read`),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  
  send: (notification: any) => api.post('/notifications', notification),
  
  getStats: () => api.get('/notifications/stats'),
};

export const usersAPI = {
  getAll: (filters?: any) => api.get('/users', { params: filters }),
  
  getById: (id: string) => api.get(`/users/${id}`),
  
  create: (userData: any) => api.post('/users', userData),
  
  update: (id: string, userData: any) => api.patch(`/users/${id}`, userData),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/users/${id}/status`, { status }),
  
  getStats: () => api.get('/users/stats'),
};