// app/(tabs)/reports.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, FileText, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, MapPin } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService, { Report } from '../../services/api';

const ReportsScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setError(null);
      const response = await apiService.getReports();
      
      if (response.success) {
        setReports(response.data.data);
      } else {
        setError('Erro ao carregar ocorrências');
      }
    } catch (error: any) {
      console.error('Error loading reports:', error);
      setError('Erro ao carregar ocorrências. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolvido':
        return <CheckCircle color="#10B981" size={20} />;
      case 'em_andamento':
        return <Clock color="#F59E0B" size={20} />;
      case 'pendente':
        return <AlertTriangle color="#EF4444" size={20} />;
      default:
        return <FileText color="#6B7280" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolvido':
        return '#10B981';
      case 'em_andamento':
        return '#F59E0B';
      case 'pendente':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return '#EF4444';
      case 'media':
        return '#F59E0B';
      case 'baixa':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Carregando ocorrências...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Ocorrências</Text>
        <TouchableOpacity
          style={styles.newReportButton}
          onPress={() => router.push('/report/new')}
        >
          <Plus color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadReports} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#9CA3AF" size={64} />
            <Text style={styles.emptyTitle}>Nenhuma ocorrência</Text>
            <Text style={styles.emptyMessage}>
              Você ainda não reportou nenhuma ocorrência. Toque no botão "+" para criar uma.
            </Text>
            <TouchableOpacity 
              style={styles.createFirstButton}
              onPress={() => router.push('/report/new')}
            >
              <Plus color="#FFFFFF" size={20} />
              <Text style={styles.createFirstButtonText}>Criar Primeira Ocorrência</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsList}>
            {/* Stats Summary */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{reports.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reports.filter(r => r.status === 'resolvido').length}
                </Text>
                <Text style={styles.statLabel}>Resolvidas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reports.filter(r => r.status === 'em_andamento').length}
                </Text>
                <Text style={styles.statLabel}>Em Andamento</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {reports.filter(r => r.status === 'pendente').length}
                </Text>
                <Text style={styles.statLabel}>Pendentes</Text>
              </View>
            </View>

            {/* Reports List */}
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => router.push(`/report/${report.id}`)}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <Text style={styles.reportType}>{report.type_text}</Text>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(report.priority) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(report.priority) },
                        ]}
                      >
                        {report.priority_text}Tudo
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(report.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(report.status) },
                      ]}
                    >
                      {report.status_text}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>

                <View style={styles.locationContainer}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.locationText}>{report.location}</Text>
                </View>

                <View style={styles.reportFooter}>
                  <Text style={styles.dateText}>
                    {formatDate(report.created_at)} às {formatTime(report.created_at)}
                  </Text>
                  {report.resolved_at && (
                    <Text style={styles.resolvedText}>
                      Resolvido em {formatDate(report.resolved_at)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  newReportButton: {
    backgroundColor: '#1E40AF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
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
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  reportsList: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  reportType: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  reportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  reportFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  resolvedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginTop: 4,
  },
});

export default ReportsScreen;