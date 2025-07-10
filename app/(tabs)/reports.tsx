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
import { Plus, FileText, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, MapPin } from 'lucide-react-native';

const ReportsScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [reports] = useState([
    {
      id: 1,
      type: 'Vazamento',
      location: 'Rua da Manga, 123',
      status: 'em_andamento',
      date: '2024-01-15',
      time: '14:30',
      priority: 'alta',
    },
    {
      id: 2,
      type: 'Falta de Água',
      location: 'Av. Eduardo Mondlane, 456',
      status: 'resolvido',
      date: '2024-01-10',
      time: '09:15',
      priority: 'media',
    },
    {
      id: 3,
      type: 'Pressão Baixa',
      location: 'Bairro da Munhava',
      status: 'pendente',
      date: '2024-01-08',
      time: '16:45',
      priority: 'baixa',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolvido':
        return 'Resolvido';
      case 'em_andamento':
        return 'Em Andamento';
      case 'pendente':
        return 'Pendente';
      default:
        return 'Desconhecido';
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
          </View>
        ) : (
          <View style={styles.reportsList}>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => router.push(`/report/${report.id}`)}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportTitleContainer}>
                    <Text style={styles.reportType}>{report.type}</Text>
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
                        {report.priority.toUpperCase()}
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
                      {getStatusText(report.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.locationContainer}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.locationText}>{report.location}</Text>
                </View>

                <View style={styles.reportFooter}>
                  <Text style={styles.dateText}>
                    {new Date(report.date).toLocaleDateString('pt-BR')} às {report.time}
                  </Text>
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
  },
  reportsList: {
    padding: 20,
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
  },
  reportType: {
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
    fontSize: 12,
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
});

export default ReportsScreen;