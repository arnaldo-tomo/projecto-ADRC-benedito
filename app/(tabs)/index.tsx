
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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  Plus, 
  Droplets, 
  TriangleAlert as AlertTriangle, 
  CircleCheck as CheckCircle, 
  Clock, 
  Phone,
  MapPin,
  FileText,
  TrendingUp,
  Settings,
  ChevronRight
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService, { Report, Notification } from '../../services/api';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🏠 HomeScreen iniciando...');
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      console.log('📥 Carregando dados da home...');
      setError(null);
      setLoading(true);
      
      // Carregar dados em paralelo com fallbacks
      const promises = [
        loadReports(),
        loadNotifications(),
        loadUnreadCount(),
        refreshUser().catch(err => {
          console.error('Erro ao atualizar usuário:', err);
          return null;
        })
      ];

      await Promise.all(promises);
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar dados da home:', error);
      setError('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
      console.log('✅ Carregamento da home concluído');
    }
  };

  const loadReports = async () => {
    try {
      console.log('📋 Carregando relatórios...');
      const response = await apiService.getReports({ page: '1' });
      if (response.success) {
        setRecentReports(response.data.data.slice(0, 3));
        console.log(`✅ ${response.data.data.length} relatórios carregados`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar relatórios:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      console.log('🔔 Carregando notificações...');
      const response = await apiService.getNotifications(1);
      if (response.success) {
        setNotifications(response.data.data.slice(0, 3));
        console.log(`✅ ${response.data.data.length} notificações carregadas`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar notificações:', error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      console.log('🔴 Carregando contador...');
      const response = await apiService.getUnreadNotificationsCount();
      if (response.success) {
        setUnreadCount(response.data.count);
        console.log(`✅ ${response.data.count} notificações não lidas`);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar contador:', error);
    }
  };

  const onRefresh = async () => {
    console.log('🔄 Refresh iniciado...');
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
    console.log('✅ Refresh concluído');
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Contacto de Emergência',
      'Ligar para o número de emergência da AdRC?\n\n📞 +258 23 323 456',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => console.log('☎️ Ligando para emergência...') },
      ]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
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
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'hoje';
      if (diffDays === 2) return 'ontem';
      if (diffDays <= 7) return `${diffDays} dias atrás`;
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Carregando...</Text>
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Moderno */}
        <View style={styles.modernHeader}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{user?.name || 'Cidadão'}</Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => router.push('/(tabs)/notifications')}
              >
                <Bell color="#1E40AF" size={22} />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Settings color="#6B7280" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <AlertTriangle color="#EF4444" size={20} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadHomeData} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => router.push('/report/new')}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <Plus color="#FFFFFF" size={24} />
              </View>
              <Text style={styles.primaryActionText}>Reportar</Text>
              <Text style={styles.primaryActionSubtext}>Problema</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.emergencyActionButton}
              onPress={handleEmergencyCall}
              activeOpacity={0.8}
            >
              <View style={styles.emergencyIconContainer}>
                <Phone color="#FFFFFF" size={20} />
              </View>
              <Text style={styles.emergencyActionText}>Emergência</Text>
            </TouchableOpacity>
          </View>

          {/* Actions Grid */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.gridAction}
              onPress={() => router.push('/(tabs)/reports')}
            >
              <FileText color="#3B82F6" size={20} />
              <Text style={styles.gridActionText}>Ocorrências</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.gridAction}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Bell color="#F59E0B" size={20} />
              <Text style={styles.gridActionText}>Suporte</Text>
            </TouchableOpacity>
            
        
            
            <TouchableOpacity style={styles.gridAction}>
              <TrendingUp color="#8B5CF6" size={20} />
              <Text style={styles.gridActionText}>Estatísticas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status do Serviço */}
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View style={styles.statusTitleContainer}>
              <Droplets color="#1E40AF" size={24} />
              <Text style={styles.statusTitle}>Status do Serviço</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
          
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <CheckCircle color="#10B981" size={20} />
              <Text style={styles.statusCardTitle}>Fornecimento</Text>
              <Text style={styles.statusCardValue}>Normal</Text>
            </View>
            
            <View style={styles.statusCard}>
              <Droplets color="#3B82F6" size={20} />
              <Text style={styles.statusCardTitle}>Qualidade</Text>
              <Text style={styles.statusCardValue}>Ótima</Text>
            </View>
            
            <View style={styles.statusCard}>
              <Clock color="#F59E0B" size={20} />
              <Text style={styles.statusCardTitle}>Pressão</Text>
              <Text style={styles.statusCardValue}>Boa</Text>
            </View>
            
            <View style={styles.statusCard}>
              <AlertTriangle color="#10B981" size={20} />
              <Text style={styles.statusCardTitle}>Interrupções</Text>
              <Text style={styles.statusCardValue}>0</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas do Usuário */}
        {user && (user.total_reports || 0) > 0 && (
          <View style={styles.userStatsSection}>
            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
                <Text style={styles.seeAllText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <FileText color="#3B82F6" size={20} />
                </View>
                <Text style={styles.statNumber}>{user.total_reports || 0}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <CheckCircle color="#10B981" size={20} />
                </View>
                <Text style={styles.statNumber}>{user.resolved_reports || 0}</Text>
                <Text style={styles.statLabel}>Resolvidas</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Clock color="#F59E0B" size={20} />
                </View>
                <Text style={styles.statNumber}>
                  {(user.total_reports || 0) - (user.resolved_reports || 0)}
                </Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
            </View>
          </View>
        )}

        {/* Ocorrências Recentes */}
        {recentReports.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Ocorrências Recentes</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Ver Todas</Text>
                  <ChevronRight color="#1E40AF" size={16} />
                </View>
              </TouchableOpacity>
            </View>
            
            {recentReports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.modernReportCard}
                onPress={() => router.push(`/report/${report.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.reportCardContent}>
                  <View style={styles.reportCardHeader}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <View style={styles.reportStatusContainer}>
                      {getStatusIcon(report.status)}
                      <Text style={styles.reportStatusText}>
                        {report.status_text}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.reportLocation}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.reportLocationText}>{report.location}</Text>
                  </View>
                  
                  <View style={styles.reportMeta}>
                    <Text style={styles.reportDate}>{formatDate(report.created_at)}</Text>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: 
                        report.priority === 'alta' ? '#FEE2E2' :
                        report.priority === 'media' ? '#FEF3C7' : '#D1FAE5'
                      }
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        { color: 
                          report.priority === 'alta' ? '#DC2626' :
                          report.priority === 'media' ? '#D97706' : '#059669'
                        }
                      ]}>
                        {report.priority?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notificações */}
        {notifications.length > 0 && (
          <View style={styles.notificationsSection}>
            <View style={styles.sectionHeaderWithAction}>
              <Text style={styles.sectionTitle}>Avisos Importantes</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/notifications')}>
                <View style={styles.seeAllButton}>
                  <Text style={styles.seeAllText}>Ver Todas</Text>
                  <ChevronRight color="#1E40AF" size={16} />
                </View>
              </TouchableOpacity>
            </View>
            
            {notifications.slice(0, 2).map((notification) => (
              <View key={notification.id} style={styles.modernNotificationCard}>
                <View style={styles.notificationIcon}>
                  {notification.type === 'warning' && <AlertTriangle color="#F59E0B" size={20} />}
                  {notification.type === 'success' && <CheckCircle color="#10B981" size={20} />}
                  {notification.type === 'emergency' && <AlertTriangle color="#EF4444" size={20} />}
                  {notification.type === 'info' && <Bell color="#3B82F6" size={20} />}
                </View>
                
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {formatDate(notification.created_at)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Dica do Dia */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>💡 Dica do Dia</Text>
          <View style={styles.modernTipCard}>
            <View style={styles.tipIcon}>
              <Droplets color="#1E40AF" size={24} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Economize Água</Text>
              <Text style={styles.tipText}>
                Verifique regularmente torneiras e canos. Um pequeno vazamento pode desperdiçar até 200 litros por dia.
              </Text>
            </View>
          </View>
        </View>

        {/* Espaçamento para tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para tab bar
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
  
  // Header Moderno
  modernHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  settingsButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginLeft: 12,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },

  // Seções
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  primaryActionButton: {
    flex: 2,
    backgroundColor: '#1E40AF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  primaryActionSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  emergencyActionButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridAction: {
    width: (width - 56) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gridActionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },

  // Status Section
  statusSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 4,
  },
  statusCardValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },

  // User Stats
  userStatsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },

  // Recent Reports
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modernReportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportCardContent: {
    padding: 16,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  reportStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  reportLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  reportLocationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },

  // Notifications
  notificationsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modernNotificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },

  // Tips Section
  tipsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modernTipCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;