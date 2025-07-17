// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService, { User } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await ApiService.login(email, password);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  }, []);

  const register = useCallback(async (userData: any) => {
    const response = await ApiService.register(userData);
    if (response.success) {
      setUser(response.data.user);
    }
    return response;
  }, []);

  const logout = useCallback(async () => {
    await ApiService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    const response = await ApiService.updateProfile(userData);
    if (response.success) {
      setUser(response.data);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
    }
    return response;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
}