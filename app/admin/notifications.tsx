import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Send, 
  Bell, 
  Users, 
  MapPin, 
  Clock,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react-native';

const AdminNotifications = () => {
  const router = useRouter();
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: 'all',
    location: '',
    scheduleEnabled: false,
    scheduleTime: '',
  });

  const notificationTypes = [
    { id: 'info', label: 'Informação', icon: <Info color="#3B82F6" size={20} />, color: '#3B82F6' },
    { id: 'warning', label: 'Aviso', icon: <AlertTriangle color="#F59E0B" size={20} />, color: '#F59E0B' },
    { id: 'emergency', label: 'Emergência', icon: <AlertTriangle color="#EF4444" size={20} />, color: '#EF4444' },
    { id: 'success', label: 'Sucesso', icon: <CheckCircle color="#10B981" size={20} />, color: '#10B981' },
  ];

  const audienceOptions = [
    { id: 'all', label: 'Todos os Usuários', icon: <Users color="#6B7280" size={20} /> },
    { id: 'location', label: 'Por Localização', icon: <MapPin color="#6B7280" size={20} /> },
    { id: 'active', label: 'Usuários Ativos', icon: <Bell color="#6B7280" size={20} /> },
  ];

  const recentNotifications = [
    {
      id: 1,
      title: 'Interrupção Programada',
      message: 'Manutenção preventiva na zona da Manga - 14h às 18h',
      type: 'warning',
      sent: '2h atrás',
      recipients: 1247,
    },
    {
      id: 2,
      title: 'Serviço Restabelecido',
      message: 'Fornecimento normalizado na Av. Eduardo Mondlane',
      type: 'success',
      sent: '5h atrás',
      recipients: 856,
    },
    {
      id: 3,
      title: 'Alerta de Emergência',
      message: 'Vazamento crítico na Rua das Flores - equipe a caminho',
      type: 'emergency',
      sent: '1 dia atrás',
      recipients: 2341,
    },
  ];

  const handleSendNotification = () => {
    if (!notificationData.title.trim() || !notificationData.message.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título e a mensagem.');
      return;
    }

    Alert.alert(
      'Confirmar Envio',
      `Deseja enviar esta notificação para ${getAudienceLabel(notificationData.targetAudience)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            // Here you would send the notification via your backend
            console.log('Sending notification:', notificationData);
            Alert.alert('Sucesso', 'Notificação enviada com sucesso!');
            // Reset form
            setNotificationData({
              title: '',
              message: '',
              type: 'info',
              targetAudience: 'all',
              location: '',
              scheduleEnabled: false,
              scheduleTime: '',
            });
          }
        }
      ]
    );
  };

  const getAudienceLabel = (audienceId: string) => {
    const audience = audienceOptions.find(opt => opt.id === audienceId);
    return audience ? audience.label : 'Desconhecido';
  };

  const getTypeColor = (type: string) => {
    const typeObj = notificationTypes.find(t => t.id === type);
    return typeObj ? typeObj.color : '#6B7280';
  };

  const updateNotificationData = (field: string, value: any) => {
    setNotificationData(prev => ({ ...prev, [field]: value }));
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
        <Text style={styles.title}>Enviar Notificações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notification Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Nova Notificação</Text>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título *</Text>
            <TextInput
              style={styles.textInput}
              value={notificationData.title}
              onChangeText={(value) => updateNotificationData('title', value)}
              placeholder="Ex: Interrupção Programada"
              maxLength={100}
            />
          </View>

          {/* Message Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mensagem *</Text>
            <TextInput
              style={styles.textArea}
              value={notificationData.message}
              onChangeText={(value) => updateNotificationData('message', value)}
              placeholder="Digite a mensagem completa..."
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {notificationData.message.length}/500
            </Text>
          </View>

          {/* Notification Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Notificação</Text>
            <View style={styles.typeGrid}>
              {notificationTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOption,
                    notificationData.type === type.id && {
                      backgroundColor: type.color + '20',
                      borderColor: type.color,
                    }
                  ]}
                  onPress={() => updateNotificationData('type', type.id)}
                >
                  {type.icon}
                  <Text style={[
                    styles.typeLabel,
                    notificationData.type === type.id && { color: type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Audience */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Público-Alvo</Text>
            <View style={styles.audienceGrid}>
              {audienceOptions.map((audience) => (
                <TouchableOpacity
                  key={audience.id}
                  style={[
                    styles.audienceOption,
                    notificationData.targetAudience === audience.id && styles.audienceOptionSelected
                  ]}
                  onPress={() => updateNotificationData('targetAudience', audience.id)}
                >
                  {audience.icon}
                  <Text style={[
                    styles.audienceLabel,
                    notificationData.targetAudience === audience.id && styles.audienceLabelSelected
                  ]}>
                    {audience.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Filter (if location-based) */}
          {notificationData.targetAudience === 'location' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Localização Específica</Text>
              <TextInput
                style={styles.textInput}
                value={notificationData.location}
                onChangeText={(value) => updateNotificationData('location', value)}
                placeholder="Ex: Bairro da Manga, Av. Eduardo Mondlane..."
              />
            </View>
          )}

          {/* Schedule Option */}
          <View style={styles.inputGroup}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.inputLabel}>Agendar Envio</Text>
              <Switch
                value={notificationData.scheduleEnabled}
                onValueChange={(value) => updateNotificationData('scheduleEnabled', value)}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={notificationData.scheduleEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
            {notificationData.scheduleEnabled && (
              <TextInput
                style={styles.textInput}
                value={notificationData.scheduleTime}
                onChangeText={(value) => updateNotificationData('scheduleTime', value)}
                placeholder="Ex: 2024-01-20 14:00"
              />
            )}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!notificationData.title.trim() || !notificationData.message.trim()) && 
              styles.sendButtonDisabled
            ]}
            onPress={handleSendNotification}
            disabled={!notificationData.title.trim() || !notificationData.message.trim()}
          >
            <Send color="#FFFFFF" size={20} />
            <Text style={styles.sendButtonText}>
              {notificationData.scheduleEnabled ? 'Agendar Notificação' : 'Enviar Agora'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Notifications */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Notificações Recentes</Text>
          {recentNotifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notification.message}
                  </Text>
                </View>
                <View 
                  style={[
                    styles.typeBadge,
                    { backgroundColor: getTypeColor(notification.type) + '20' }
                  ]}
                >
                  <Text 
                    style={[
                      styles.typeText,
                      { color: getTypeColor(notification.type) }
                    ]}
                  >
                    {notification.type.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.notificationFooter}>
                <Text style={styles.notificationTime}>
                  <Clock color="#9CA3AF" size={12} /> {notification.sent}
                </Text>
                <Text style={styles.notificationRecipients}>
                  <Users color="#9CA3AF" size={12} /> {notification.recipients} usuários
                </Text>
              </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  audienceGrid: {
    gap: 12,
  },
  audienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  audienceOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#3B82F6',
  },
  audienceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  audienceLabelSelected: {
    color: '#3B82F6',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  recentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationInfo: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  notificationRecipients: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});

export default AdminNotifications;