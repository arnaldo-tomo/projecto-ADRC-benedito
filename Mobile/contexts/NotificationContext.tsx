import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Vibration, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import apiService, { Notification as NotificationModel } from '../services/api';

interface NotificationContextType {
  notifications: NotificationModel[];
  unreadCount: number;
  loading: boolean;
  loadNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeNotifications();
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isAuthenticated, user]);

  // Listener para quando app volta do background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && isAuthenticated) {
        console.log('📱 App voltou do background - verificando notificações...');
        checkForNewNotifications();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAuthenticated, lastCheckTime]);

  const cleanup = () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      setCheckInterval(null);
    }
  };

  const initializeNotifications = async () => {
    console.log('🔔 Inicializando sistema de notificações...');
    
    await loadLastCheckTime();
    await loadNotifications();
    await loadUnreadCount();
    
    // Verificar novas notificações a cada 30 segundos
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkForNewNotifications();
      }
    }, 30000);
    
    setCheckInterval(interval);
  };

  const loadLastCheckTime = async () => {
    try {
      const lastCheck = await AsyncStorage.getItem(`last_notification_check_${user?.id}`);
      setLastCheckTime(lastCheck);
      console.log('⏰ Último check:', lastCheck || 'Nunca');
    } catch (error) {
      console.error('Erro ao carregar último check:', error);
    }
  };

  const saveLastCheckTime = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(`last_notification_check_${user?.id}`, now);
      setLastCheckTime(now);
      console.log('✅ Timestamp salvo:', now);
    } catch (error) {
      console.error('Erro ao salvar timestamp:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications(1);
      if (response.success) {
        setNotifications(response.data.data);
        console.log(`📋 ${response.data.data.length} notificações carregadas`);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadNotificationsCount();
      if (response.success) {
        setUnreadCount(response.data.count);
        console.log(`🔴 ${response.data.count} notificações não lidas`);
      }
    } catch (error) {
      console.error('Erro ao carregar contador:', error);
    }
  };

  const checkForNewNotifications = async () => {
    try {
      if (!lastCheckTime) {
        console.log('🆕 Primeiro check - salvando timestamp');
        await saveLastCheckTime();
        return;
      }

      console.log('🔍 Verificando notificações novas...');
      const response = await apiService.getNotificationsAfter(lastCheckTime);
      
      if (response.success && response.data.length > 0) {
        console.log(`🎉 ${response.data.length} nova(s) notificação(ões) encontrada(s)!`);
        
        // Mostrar primeira notificação como "local notification"
        showLocalNotification(response.data[0]);
        
        // Atualizar lista local
        setNotifications(prev => [...response.data, ...prev]);
        
        // Atualizar contadores
        await loadUnreadCount();
        await saveLastCheckTime();
      } else {
        console.log('✅ Nenhuma notificação nova');
      }
    } catch (error) {
      console.error('Erro ao verificar novas notificações:', error);
    }
  };

  const showLocalNotification = (notification: NotificationModel) => {
    console.log('🔔 NOVA NOTIFICAÇÃO:', notification.title);
    
    // Vibrar para chamar atenção
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 250, 250, 250]);
      } else {
        Vibration.vibrate();
      }
    } catch (error) {
      console.log('Vibração não disponível:', error);
    }
    
    // Aqui você pode adicionar um Toast, Alert, ou modal se quiser
    // import { Alert } from 'react-native';
    // Alert.alert('Nova Notificação', notification.title);
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
      
      await loadUnreadCount();
      console.log(`✅ Notificação ${notificationId} marcada como lida`);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      
      // Atualizar estado local
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      
      setUnreadCount(0);
      console.log('✅ Todas as notificações marcadas como lidas');
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const refreshNotifications = async () => {
    console.log('🔄 Atualizando notificações...');
    await Promise.all([
      loadNotifications(),
      loadUnreadCount(),
      checkForNewNotifications()
    ]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};