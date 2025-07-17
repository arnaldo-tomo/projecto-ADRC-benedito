// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Plus, Droplets, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Phone } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService, { Notification, Report } from '../../services/api';

const HomeScreen = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setError(null);
      
      // Carregar dados em paralelo
      const [notificationsResponse, reportsResponse, unreadResponse] = await Promise.all([
        apiService.getNotifications(1).catch(err => ({ success: false, data: { data: [] } })),
        apiService.getReports({ page: '1' }).catch(err => ({ success: false, data: { data: [] } })),
        apiService.getUnreadNotificationsCount().catch(err => ({ success: false, data: { count: 0 } }))
      ]);

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.data.slice(0, 3)); // Apenas as 3 primeiras
      }

      if (reportsResponse.success) {
        setRecentReports(reportsResponse.data.data.slice(0, 3)); // Apenas as 3 primeiras
      }

      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data.count);
      }

      // Atualizar dados do usuário
      await refreshUser();
      
    } catch (error: any) {
      console.error('Error loading home data:', error);
      setError('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Contacto de Emergência',
      'Ligar para o número de emergência da AdRC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => console.log('Ligando para emergência...') },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle color="#F59E0B" size={20} />;
      case 'success':
        return <CheckCircle color="#10B981" size={20} />;
      case 'emergency':
        return <AlertTriangle color="#EF4444" size={20} />;
      default:
        return <Bell color="#6B7280" size={20} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolvido':
        return <CheckCircle color="#10B981" size={16} />;
      case 'em_andamento':
        return <Clock color="#F59E0B" size={16} />;
      case 'pendente':
        return <AlertTriangle color="#EF4444" size={16} />;
      default:
        return <Clock color="#6B7280" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'hoje';
    } else if (diffDays === 2) {
      return 'ontem';
    } else if (diffDays <= 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const retryLoad = () => {
    setLoading(true);
    loadHomeData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name || 'Cidadão'}!</Text>
            <Text style={styles.subtitle}>Como podemos ajudá-lo hoje?</Text>
          </View>
          <TouchableOpacity 
            style={styles.bellButton}
            onPress={() => router.push('/(tabs)/notifications')}
          >
            <Bell color="#1E40AF" size={24} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={retryLoad} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/report/new')}
          >
            <Plus color="#FFFFFF" size={24} />
            <Text style={styles.actionText}>Reportar Problema</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleEmergencyCall}
          >
            <Phone color="#1E40AF" size={20} />
            <Text style={styles.secondaryText}>Emergência</Text>
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Droplets color="#1E40AF" size={24} />
            <Text style={styles.statusTitle}>Status do Serviço</Text>
          </View>
          <View style={styles.statusContent}>
            <View style={styles.statusItem}>
              <CheckCircle color="#10B981" size={16} />
              <Text style={styles.statusItemText}>Fornecimento Normal</Text>
            </View>
            <View style={styles.statusItem}>
              <Clock color="#F59E0B" size={16} />
              <Text style={styles.statusItemText}>
                {notifications.filter(n => n.type === 'warning').length} Interrupções Programadas
              </Text>
            </View>
          </View>
        </View>

        {/* User Reports Stats */}
        {user && (user.total_reports || 0) > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Suas Ocorrências</Text>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.total_reports || 0}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.resolved_reports || 0}</Text>
                <Text style={styles.statLabel}>Resolvidas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {(user.total_reports || 0) - (user.resolved_reports || 0)}
                </Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Suas Ocorrências Recentes</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
                <Text style={styles.seeAllText}>Ver Todas</Text>
              </TouchableOpacity>
            </View>
            {recentReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => router.push(`/report/${report.id}`)}
              >
                <View style={styles.reportHeader}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <View style={styles.reportStatus}>
                    {getStatusIcon(report.status)}
                    <Text style={styles.reportStatusText}>{report.status_text}</Text>
                  </View>
                </View>
                <Text style={styles.reportLocation}>{report.location}</Text>
                <Text style={styles.reportDate}>{formatDate(report.created_at)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <View style={styles.notificationsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notificações Recentes</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/notifications')}>
                <Text style={styles.seeAllText}>Ver Todas</Text>
              </TouchableOpacity>
            </View>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={styles.notificationHeader}>
                  {getNotificationIcon(notification.type)}
                  <Text style={styles.notificationTime}>
                    {formatDate(notification.created_at)}
                  </Text>
                </View>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Dicas de Economia</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💧 Verifique vazamentos</Text>
            <Text style={styles.tipText}>
              Verifique regularmente torneiras e canos. Um pequeno vazamento pode desperdiçar milhares de litros por mês.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  bellButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: {
    color: '#1E40AF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statusContent: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1E40AF',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  reportLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  notificationsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default HomeScreen;