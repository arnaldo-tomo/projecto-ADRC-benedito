import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  Share,
  Image
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
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
  Eye,
  Share2,
  Navigation
} from 'lucide-react-native'
import { useAuth } from '../../contexts/AuthContext'
import { Report } from '../../services/api'

const ReportDetailScreen = () => {
  const router = useRouter()
  const { id, report: reportParam } = useLocalSearchParams<{
    id: string
    report?: string
  }>()
  const { user } = useAuth()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id && reportParam) {
      try {
        const parsedReport = JSON.parse(reportParam) as Report
        setReport(parsedReport)
        setLoading(false)
      } catch (parseError) {
        console.error('Error parsing report param:', parseError)
        setError('Erro ao carregar dados da ocorrência')
        setLoading(false)
      }
    } else {
      setError('Ocorrência não encontrada')
      setLoading(false)
    }
  }, [id, reportParam])

  const handleShareReport = async () => {
    try {
      const shareContent = {
        message: `Ocorrência AdRC: ${report?.type_text} - ${report?.location}\n\nDescrição: ${report?.description}\n\nStatus: ${report?.status_text}`,
        url: `adrc://report/${id}`
      }

      if (Platform.OS === 'ios') {
        await Share.share({
          message: shareContent.message,
          url: shareContent.url
        })
      } else {
        await Share.share({
          message: `${shareContent.message}\n\n${shareContent.url}`
        })
      }
    } catch (error) {
      console.error('Error sharing report:', error)
    }
  }

  const handleOpenLocation = () => {
    if (report?.latitude && report?.longitude) {
      const url = Platform.select({
        ios: `maps:0,0?q=${report.latitude},${report.longitude}`,
        android: `geo:0,0?q=${report.latitude},${report.longitude}`
      })

      if (url) {
        Linking.openURL(url).catch(() => {
          Alert.alert('Erro', 'Não foi possível abrir o mapa.')
        })
      }
    } else {
      Alert.alert(
        'Informação',
        'Localização não disponível para esta ocorrência.'
      )
    }
  }

  const handleCallEmergency = () => {
    Alert.alert(
      'Emergência',
      'Deseja ligar para o número de emergência da AdRC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ligar', onPress: () => Linking.openURL('tel:+258800000000') }
      ]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolvido':
        return <CheckCircle color='#10B981' size={20} />
      case 'em_andamento':
        return <Clock color='#F59E0B' size={20} />
      case 'pendente':
        return <AlertTriangle color='#EF4444' size={20} />
      default:
        return <Clock color='#6B7280' size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolvido':
        return '#10B981'
      case 'em_andamento':
        return '#F59E0B'
      case 'pendente':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return '#EF4444'
      case 'media':
        return '#F59E0B'
      case 'baixa':
        return '#10B981'
      default:
        return '#6B7280'
    }
  }


    const formatPriorityText = (priority: string) => {
    switch (priority) {
      case 'vazamento':
        return 'Vazamento';
      case 'falta_agua':
        return 'Falta de Água';
      case 'pressao_baixa':
        return 'Pressão Baixa';
           case 'qualidade_agua':
        return 'Qualidade da Água';
           case 'em_andamento':
        return 'Em andamento';
      default:
        return 'Outros';
    }
  };
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    )}`
  }

  const handleContactSupport = () => {
    router.push('/(tabs)/chat')
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#1E40AF' />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color='#1F2937' size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Ocorrência</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.errorContainer}>
          <AlertTriangle color='#EF4444' size={48} />
          <Text style={styles.errorTitle}>Erro ao Carregar</Text>
          <Text style={styles.errorText}>
            {error || 'Ocorrência não encontrada'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color='#1F2937' size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ocorrência #{report.id}</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShareReport}
        >
          <Share2 color='#1F2937' size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusLeft}>
              <Text style={styles.reportType}>{formatPriorityText(report.type)}</Text>
              <Text style={styles.reportTitle}>{report.title}</Text>
              <View style={styles.statusBadge}>
                {getStatusIcon(report.status)}
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(report.status) }
                  ]}
                >
                  {report.status}
                </Text>
              </View>
            </View>
            <View style={styles.priorityContainer}>
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
                  {report.priority}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Informações da Ocorrência</Text>

          <View style={styles.detailRow}>
            <MapPin color='#6B7280' size={16} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Localização</Text>
              <Text style={styles.detailValue}>{report.location}</Text>
            </View>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleOpenLocation}
            >
              <Navigation color='#1E40AF' size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Calendar color='#6B7280' size={16} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Data e Hora</Text>
              <Text style={styles.detailValue}>
                {formatDateTime(report.created_at)}
              </Text>
            </View>
          </View>

          {report.user && (
            <View style={styles.detailRow}>
              <User color='#6B7280' size={16} />
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
            <View style={styles.adminNotesSection}>
              <Text style={styles.descriptionTitle}>Observações da Equipe</Text>
              <Text style={styles.descriptionText}>{report.admin_notes}</Text>
            </View>
          )}

          {report.resolved_at && (
            <View style={styles.resolvedSection}>
              <Text style={styles.resolvedTitle}>✅ Resolvido</Text>
              <Text style={styles.resolvedText}>
                Ocorrência resolvida em {formatDateTime(report.resolved_at)}
              </Text>
            </View>
          )}
        </View>

          {report.photos && report.photos.length > 0 && (
          <View style={styles.photosCard}>
            <Text style={styles.cardTitle}>Fotos da Ocorrência</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {report.photos.map((photoUrl, index) => (
                <TouchableOpacity key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photoUrl }} style={styles.photo} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Histórico</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[styles.timelineIcon, styles.timelineIconActive]}>
                  <Eye color='#FFFFFF' size={12} />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineMessage}>Ocorrência criada</Text>
                <Text style={styles.timelineTime}>
                  {formatDateTime(report.created_at)}
                </Text>
              </View>
            </View>

            {report.status === 'em_andamento' && (
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[styles.timelineIcon, styles.timelineIconActive]}
                  >
                    <Clock color='#FFFFFF' size={12} />
                  </View>
                  {report.status !== 'resolvido' && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineMessage}>Em andamento</Text>
                  <Text style={styles.timelineTime}>
                    Equipe trabalhando na resolução
                  </Text>
                </View>
              </View>
            )}

            {report.resolved_at && (
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[styles.timelineIcon, styles.timelineIconActive]}
                  >
                    <CheckCircle color='#FFFFFF' size={12} />
                  </View>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineMessage}>Resolvido</Text>
                  <Text style={styles.timelineTime}>
                    {formatDateTime(report.resolved_at)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleContactSupport}
          >
            <MessageCircle color='#FFFFFF' size={20} />
            <Text style={styles.primaryButtonText}>Entrar em Contato</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.emergencyButton, { marginTop: 12 }]}
            onPress={handleCallEmergency}
          >
            <Phone color='#FFFFFF' size={20} />
            <Text style={styles.emergencyButtonText}>Emergência</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937'
  },
  placeholder: {
    width: 40
  },
  content: {
    flex: 1,
    padding: 20
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
    elevation: 3
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  statusLeft: {
    flex: 1
  },
  reportType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4
  },
  reportTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold'
  },
  priorityContainer: {
    alignItems: 'flex-end'
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold'
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
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12
  },
  detailContent: {
    flex: 1
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937'
  },
  locationButton: {
    padding: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 8
  },
  descriptionSection: {
    marginTop: 8
  },
  descriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20
  },
  adminNotesSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12
  },
  resolvedSection: {
    marginTop: 16,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981'
  },
  resolvedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginBottom: 8
  },
  resolvedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#047857'
  },
  photosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  photoContainer: {
    marginRight: 12,
    width: 120
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#F3F4F6'
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
    elevation: 3
  },
  timeline: {
    marginTop: 8
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 12
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  timelineIconActive: {
    backgroundColor: '#1E40AF'
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginTop: 4
  },
  timelineContent: {
    flex: 1
  },
  timelineMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 4
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF'
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
    elevation: 3
  },
  primaryButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold'
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold'
  }
})

export default ReportDetailScreen
