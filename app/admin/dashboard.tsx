import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  BarChart3, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  MapPin,
  Droplets
} from 'lucide-react-native';

const AdminDashboard = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = () => {
    router.replace('/admin');
  };

  const stats = {
    totalReports: 156,
    pendingReports: 23,
    resolvedReports: 133,
    activeUsers: 1247,
    todayReports: 12,
    avgResponseTime: '2.5h',
  };

  const recentReports = [
    {
      id: 1,
      type: 'Vazamento',
      location: 'Rua da Manga, 123',
      status: 'pendente',
      time: '10 min atrás',
      priority: 'alta',
    },
    {
      id: 2,
      type: 'Falta de Água',
      location: 'Av. Eduardo Mondlane',
      status: 'em_andamento',
      time: '25 min atrás',
      priority: 'media',
    },
    {
      id: 3,
      type: 'Pressão Baixa',
      location: 'Bairro da Munhava',
      status: 'resolvido',
      time: '1h atrás',
      priority: 'baixa',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#EF4444';
      case 'em_andamento': return '#F59E0B';
      case 'resolvido': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return '#EF4444';
      case 'media': return '#F59E0B';
      case 'baixa': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Painel AdRC</Text>
          <Text style={styles.headerSubtitle}>Dashboard Administrativo</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/admin/notifications')}
          >
            <Bell color="#6B7280" size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/admin/settings')}
          >
            <Settings color="#6B7280" size={20} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut color="#EF4444" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.content}
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FileText color="#3B82F6" size={24} />
            <Text style={styles.statNumber}>{stats.totalReports}</Text>
            <Text style={styles.statLabel}>Total Ocorrências</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock color="#F59E0B" size={24} />
            <Text style={styles.statNumber}>{stats.pendingReports}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          
          <View style={styles.statCard}>
            <CheckCircle color="#10B981" size={24} />
            <Text style={styles.statNumber}>{stats.resolvedReports}</Text>
            <Text style={styles.statLabel}>Resolvidas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Users color="#8B5CF6" size={24} />
            <Text style={styles.statNumber}>{stats.activeUsers}</Text>
            <Text style={styles.statLabel}>Usuários Ativos</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Métricas de Performance</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <TrendingUp color="#10B981" size={20} />
              <Text style={styles.metricValue}>{stats.todayReports}</Text>
              <Text style={styles.metricLabel}>Hoje</Text>
            </View>
            <View style={styles.metricCard}>
              <Clock color="#3B82F6" size={20} />
              <Text style={styles.metricValue}>{stats.avgResponseTime}</Text>
              <Text style={styles.metricLabel}>Tempo Médio</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/reports')}
            >
              <FileText color="#3B82F6" size={24} />
              <Text style={styles.actionText}>Gerenciar Ocorrências</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/notifications')}
            >
              <Bell color="#F59E0B" size={24} />
              <Text style={styles.actionText}>Enviar Notificações</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/users')}
            >
              <Users color="#8B5CF6" size={24} />
              <Text style={styles.actionText}>Usuários</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <BarChart3 color="#10B981" size={24} />
              <Text style={styles.actionText}>Relatórios</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.reportsContainer}>
          <View style={styles.reportsHeader}>
            <Text style={styles.sectionTitle}>Ocorrências Recentes</Text>
            <TouchableOpacity onPress={() => router.push('/admin/reports')}>
              <Text style={styles.viewAllText}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          
          {recentReports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportType}>{report.type}</Text>
                  <View style={styles.reportLocation}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.locationText}>{report.location}</Text>
                  </View>
                </View>
                <View style={styles.reportMeta}>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(report.status) + '20' }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusText, 
                        { color: getStatusColor(report.status) }
                      ]}
                    >
                      {report.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View 
                    style={[
                      styles.priorityDot, 
                      { backgroundColor: getPriorityColor(report.priority) }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.reportTime}>{report.time}</Text>
            </View>
          ))}
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  metricsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
  reportsContainer: {
    marginBottom: 32,
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reportMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reportTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});

export default AdminDashboard;