import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  X
} from 'lucide-react-native';

const AdminReports = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const reports = [
    {
      id: 1,
      type: 'Vazamento',
      location: 'Rua da Manga, 123',
      description: 'Vazamento significativo na calçada em frente ao número 123. Água jorrando há aproximadamente 2 horas.',
      status: 'pendente',
      priority: 'alta',
      date: '2024-01-15',
      time: '14:30',
      user: 'João Silva',
      phone: '+258 84 123 4567',
      coordinates: { lat: -19.8157, lng: 34.8369 },
    },
    {
      id: 2,
      type: 'Falta de Água',
      location: 'Av. Eduardo Mondlane, 456',
      description: 'Sem fornecimento de água há 3 dias. Toda a vizinhança está afetada.',
      status: 'em_andamento',
      priority: 'media',
      date: '2024-01-10',
      time: '09:15',
      user: 'Maria Santos',
      phone: '+258 84 987 6543',
      coordinates: { lat: -19.8200, lng: 34.8400 },
    },
    {
      id: 3,
      type: 'Pressão Baixa',
      location: 'Bairro da Munhava',
      description: 'Pressão muito baixa durante o dia, especialmente entre 12h e 18h.',
      status: 'resolvido',
      priority: 'baixa',
      date: '2024-01-08',
      time: '16:45',
      user: 'Carlos Pereira',
      phone: '+258 84 555 1234',
      coordinates: { lat: -19.8100, lng: 34.8300 },
    },
    {
      id: 4,
      type: 'Qualidade da Água',
      location: 'Rua das Flores, 789',
      description: 'Água com cor amarelada e odor estranho desde ontem.',
      status: 'pendente',
      priority: 'alta',
      date: '2024-01-14',
      time: '08:20',
      user: 'Ana Costa',
      phone: '+258 84 777 8888',
      coordinates: { lat: -19.8180, lng: 34.8350 },
    },
  ];

  const filters = [
    { id: 'todos', label: 'Todos', count: reports.length },
    { id: 'pendente', label: 'Pendentes', count: reports.filter(r => r.status === 'pendente').length },
    { id: 'em_andamento', label: 'Em Andamento', count: reports.filter(r => r.status === 'em_andamento').length },
    { id: 'resolvido', label: 'Resolvidos', count: reports.filter(r => r.status === 'resolvido').length },
  ];

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolvido': return 'Resolvido';
      case 'em_andamento': return 'Em Andamento';
      case 'pendente': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolvido': return '#10B981';
      case 'em_andamento': return '#F59E0B';
      case 'pendente': return '#EF4444';
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

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'todos' || report.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusChange = (reportId: number, newStatus: string) => {
    Alert.alert(
      'Alterar Status',
      `Confirma a alteração do status para "${getStatusText(newStatus)}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => {
          // Here you would update the report status in your backend
          console.log(`Updating report ${reportId} to status ${newStatus}`);
          setSelectedReport(null);
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Gerenciar Ocorrências</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por tipo, localização ou usuário..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterTab,
              selectedFilter === filter.id && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text style={[
              styles.filterTabText,
              selectedFilter === filter.id && styles.filterTabTextActive
            ]}>
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reports List */}
      <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
        {filteredReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportType}>{report.type}</Text>
                <View style={styles.reportLocation}>
                  <MapPin color="#6B7280" size={14} />
                  <Text style={styles.locationText}>{report.location}</Text>
                </View>
                <Text style={styles.reportUser}>Por: {report.user}</Text>
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
                    {getStatusText(report.status)}
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

            <Text style={styles.reportDescription} numberOfLines={2}>
              {report.description}
            </Text>

            <View style={styles.reportFooter}>
              <Text style={styles.reportTime}>
                {new Date(report.date).toLocaleDateString('pt-BR')} às {report.time}
              </Text>
              <View style={styles.reportActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setSelectedReport(report)}
                >
                  <Eye color="#3B82F6" size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageSquare color="#10B981" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Report Details Modal */}
      <Modal
        visible={!!selectedReport}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedReport(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedReport && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedReport.type}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedReport(null)}
                  >
                    <X color="#6B7280" size={24} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Localização:</Text>
                    <Text style={styles.detailValue}>{selectedReport.location}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Descrição:</Text>
                    <Text style={styles.detailValue}>{selectedReport.description}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Usuário:</Text>
                    <Text style={styles.detailValue}>{selectedReport.user}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Telefone:</Text>
                    <Text style={styles.detailValue}>{selectedReport.phone}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Data/Hora:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedReport.date).toLocaleDateString('pt-BR')} às {selectedReport.time}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Status Atual:</Text>
                    <View style={styles.statusContainer}>
                      {getStatusIcon(selectedReport.status)}
                      <Text style={[styles.detailValue, { marginLeft: 8 }]}>
                        {getStatusText(selectedReport.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Prioridade:</Text>
                    <View style={styles.priorityContainer}>
                      <View 
                        style={[
                          styles.priorityIndicator, 
                          { backgroundColor: getPriorityColor(selectedReport.priority) }
                        ]} 
                      />
                      <Text style={styles.detailValue}>
                        {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.statusButton, { backgroundColor: '#F59E0B' }]}
                    onPress={() => handleStatusChange(selectedReport.id, 'em_andamento')}
                  >
                    <Text style={styles.statusButtonText}>Em Andamento</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.statusButton, { backgroundColor: '#10B981' }]}
                    onPress={() => handleStatusChange(selectedReport.id, 'resolvido')}
                  >
                    <Text style={styles.statusButtonText}>Resolver</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  reportsList: {
    flex: 1,
    padding: 20,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reportUser: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
  reportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  reportTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});

export default AdminReports;