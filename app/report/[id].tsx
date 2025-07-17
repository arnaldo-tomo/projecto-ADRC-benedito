// app/report/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService, { Report } from '../../services/api';

const ReportDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.getReport(parseInt(id!));
      
      if (response.success) {
        setReport(response.data);
      } else {
        setError('Erro ao carregar detalhes da ocorrência');
      }
    } catch (error: any) {
      console.error('Error loading report:', error);
      setError('Erro ao carregar detalhes. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
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
        return <Clock color="#6B7280" size={20} />;
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

  const handleContactSupport = () => {
    router.push('/(tabs)/chat');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft color="#1F2937" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <AlertTriangle color="#EF4444" size={48} />
          <Text style={styles.errorTitle}>Erro ao Carregar</Text>
          <Text style={styles.errorText}>{error || 'Ocorrência não encontrada'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadReport}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Text style={styles.reportType}>{report.type_text}</Text>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <View style={styles.statusBadge}>
                {getStatusIcon(report.status)}
                <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                  {report.status_text}
                </Text>
              </View>
            </View>
            <View 
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(report.priority) + '20' }
              ]}
            >
              <Text 
                style={[
                  styles.priorityText,
                  { color: getPriorityColor(report.priority) }
                ]}
              >
                {report.priority_text}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Informações da Ocorrência</Text>
          
          <View style={styles.detailRow}>
            <MapPin color="#6B7280" size={16} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Localização</Text>
              <Text style={styles.detailValue}>{report.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Calendar color="#6B7280" size={16} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Data e Hora</Text>
              <Text style={styles.detailValue}>
                {formatDate(report.created_at)} às {formatTime(report.created_at)}
              </Text>
            </View>
          </View>

          {report.user && (
            <View style={styles.detailRow}>
              <User color="#6B7280" size={16} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Reportado por</Text>
                <Text style={styles.detailValue}>{report.user.name}</Text>
              </View>
            </View>
          )}

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{report.description}</Text>
          </View>

          {report.admin_notes && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Observações da Equipe</Text>
              <Text style={styles.descriptionText}>{report.admin_notes}</Text>
            </View>
          )}

          {report.resolved_at && (
            <View style={styles.resolvedSection}>
              <Text style={styles.resolvedTitle}>✅ Resolvido</Text>
              <Text style={styles.resolvedText}>
                Ocorrência resolvida em {formatDate(report.resolved_at)} às {formatTime(report.resolved_at)}
              </Text>
            </View>
          )}
        </View>

        {/* Timeline Card */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Histórico</Text>
          
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[styles.timelineIcon, styles.timelineIconActive]}>
                  <Eye color="#FFFFFF" size={12} />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineMessage}>Ocorrência criada</Text>
                <Text style={styles.timelineTime}>
                  {formatDate(report.created_at)} às {formatTime(report.created_at)}
                </Text>
              </View>
            </View>

            {report.status === 'em_andamento' && (
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.timelineIconActive]}>
                    <Clock color="#FFFFFF" size={12} />
                  </View>
                  {report.status !== 'resolvido' && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineMessage}>Em andamento</Text>
                  <Text style={styles.timelineTime}>Equipe trabalhando na resolução</Text>
                </View>
              </View>
            )}

            {report.resolved_at && (
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, styles.timelineIconActive]}>
                    <CheckCircle color="#FFFFFF" size={12} />
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineMessage}>Resolvido</Text>
                  <Text style={styles.timelineTime}>
                    {formatDate(report.resolved_at)} às {formatTime(report.resolved_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleContactSupport}
          >
            <MessageCircle color="#FFFFFF" size={20} />
            <Text style={styles.primaryButtonText}>Entrar em Contato</Text>
          </TouchableOpacity>

       
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusLeft: {
    flex: 1,
  },
  reportType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  resolvedSection: {
    marginTop: 16,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  resolvedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8,
  },
  resolvedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconActive: {
    backgroundColor: '#1E40AF',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    backgroundColor: '#E0E7FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

export default ReportDetailScreen;