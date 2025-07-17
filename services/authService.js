// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  constructor() {
    this.apiUrl = 'https://your-api-url.com/api'; // Substitua pela sua URL
    this.token = null;
  }

  async initialize() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error initializing auth service:', error);
      return null;
    }
  }

  async login(email, password) {
    try {
      // Para demonstração, vamos simular um login bem-sucedido
      const mockToken = 'mock-jwt-token-' + Date.now();
      await AsyncStorage.setItem('auth_token', mockToken);
      this.token = mockToken;
      
      // Simular dados do usuário
      const userData = {
        id: 1,
        name: 'João Silva',
        email: email,
        role: 'user'
      };
      
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      
      return {
        success: true,
        token: mockToken,
        user: userData
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Erro ao fazer login'
      };
    }
  }

  async logout() {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_data']);
      this.token = null;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  }

  async getUser() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async isAuthenticated() {
    const token = await this.initialize();
    return !!token;
  }

  getToken() {
    return this.token;
  }

  // Método para fazer requisições autenticadas
  async makeAuthenticatedRequest(url, options = {}) {
    const token = await this.initialize();
    
    if (!token) {
      throw new Error('Unauthenticated');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token inválido, fazer logout
        await this.logout();
        throw new Error('Unauthenticated');
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }
}

export default new AuthService();