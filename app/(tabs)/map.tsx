import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Filter, Layers, Navigation, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Droplets } from 'lucide-react-native';

const MapScreen = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    vazamento: true,
    falta_agua: true,
    pressao_baixa: true,
    resolvido: true,
    em_andamento: true,
    pendente: true,
  });

  const reports = [
    {
      id: 1,
      type: 'vazamento',
      location: 'Rua da Manga, 123',
      status: 'em_andamento',
      priority: 'alta',
      coordinates: { lat: -19.8157, lng: 34.8369 },
      date: '2024-01-15',
      time: '14:30',
      description: 'Vazamento significativo na calçada',
    },
    {
      id: 2,
      type: 'falta_agua',
      location: 'Av. Eduardo Mondlane, 456',
      status: 'resolvido',
      priority: 'media',
      coordinates: { lat: -19.8200, lng: 34.8400 },
      date: '2024-01-10',
      time: '09:15',
      description: 'Sem água há 3 dias',
    },
    {
      id: 3,
      type: 'pressao_baixa',
      location: 'Bairro da Munhava',
      status: 'pendente',
      priority: 'baixa',
      coordinates: { lat: -19.8100, lng: 34.8300 },
      date: '2024-01-08',
      time: '16:45',
      description: 'Pressão muito baixa durante o dia',
    },
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
        return <MapPin color="#6B7280" size={16} />;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vazamento':
        return <Droplets color="#3B82F6" size={20} />;
      case 'falta_agua':
        return <AlertTriangle color="#EF4444" size={20} />;
      case 'pressao_baixa':
        return <Navigation color="#F59E0B" size={20} />;
      default:
        return <MapPin color="#6B7280" size={20} />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vazamento':
        return 'Vazamento';
      case 'falta_agua':
        return 'Falta de Água';
      case 'pressao_baixa':
        return 'Pressão Baixa';
      default:
        return 'Outros';
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

  const filteredReports = reports.filter(report => {
    return activeFilters[report.type as keyof typeof activeFilters] && 
           activeFilters[report.status as keyof typeof activeFilters];
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Ocorrências</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter color="#1E40AF" size={20} />
        </TouchableOpacity>
      </View>

      {/* Simulated Map Area */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin color="#9CA3AF" size={48} />
          <Text style={styles.mapText}>
            Mapa Interativo
          </Text>
          <Text style={styles.mapSubtext}>
            Cidade da Beira - Moçambique
          </Text>
        </View>

        {/* Map Markers */}
        {filteredReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={[
              styles.marker,
              { 
                backgroundColor: getPriorityColor(report.priority),
                top: `${30 + report.id * 15}%`,
                left: `${40 + report.id * 10}%`,
              }
            ]}
            onPress={() => setSelectedReport(report)}
          >
            {getTypeIcon(report.type)}
          </TouchableOpacity>
        ))}
      </View>

      {/* Reports List */}
      <View style={styles.reportsList}>
        <Text style={styles.reportsTitle}>Ocorrências na Área</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => setSelectedReport(report)}
            >
              <View style={styles.reportHeader}>
                {getTypeIcon(report.type)}
                <Text style={styles.reportType}>{getTypeText(report.type)}</Text>
              </View>
              <Text style={styles.reportLocation}>{report.location}</Text>
              <View style={styles.reportFooter}>
                {getStatusIcon(report.status)}
                <Text style={styles.reportStatus}>{getStatusText(report.status)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
                  <Text style={styles.modalTitle}>
                    {getTypeText(selectedReport.type)}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedReport(null)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <MapPin color="#6B7280" size={16} />
                    <Text style={styles.detailText}>{selectedReport.location}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    {getStatusIcon(selectedReport.status)}
                    <Text style={styles.detailText}>
                      {getStatusText(selectedReport.status)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(selectedReport.priority) }
                      ]}
                    />
                    <Text style={styles.detailText}>
                      Prioridade: {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)}
                    </Text>
                  </View>

                  <Text style={styles.descriptionTitle}>Descrição:</Text>
                  <Text style={styles.descriptionText}>
                    {selectedReport.description}
                  </Text>

                  <Text style={styles.dateText}>
                    Reportado em {new Date(selectedReport.date).toLocaleDateString('pt-BR')} às {selectedReport.time}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersContainer}>
              <Text style={styles.filterSection}>Tipo de Ocorrência</Text>
              {['vazamento', 'falta_agua', 'pressao_baixa'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.filterOption}
                  onPress={() => setActiveFilters(prev => ({
                    ...prev,
                    [type]: !prev[type as keyof typeof prev]
                  }))}
                >
                  <View style={[
                    styles.checkbox,
                    activeFilters[type as keyof typeof activeFilters] && styles.checkboxActive
                  ]}>
                    {activeFilters[type as keyof typeof activeFilters] && (
                      <CheckCircle color="#FFFFFF" size={16} />
                    )}
                  </View>
                  <Text style={styles.filterLabel}>{getTypeText(type)}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.filterSection}>Status</Text>
              {['resolvido', 'em_andamento', 'pendente'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.filterOption}
                  onPress={() => setActiveFilters(prev => ({
                    ...prev,
                    [status]: !prev[status as keyof typeof prev]
                  }))}
                >
                  <View style={[
                    styles.checkbox,
                    activeFilters[status as keyof typeof activeFilters] && styles.checkboxActive
                  ]}>
                    {activeFilters[status as keyof typeof activeFilters] && (
                      <CheckCircle color="#FFFFFF" size={16} />
                    )}
                  </View>
                  <Text style={styles.filterLabel}>{getStatusText(status)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  filterButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  mapText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reportsList: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  reportsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  reportCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginLeft: 20,
    marginRight: 8,
    width: 200,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reportType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  reportLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reportStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6B7280',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  priorityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 8,
  },
  filtersContainer: {
    maxHeight: 400,
    paddingHorizontal: 20,
  },
  filterSection: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 16,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
});

export default MapScreen;