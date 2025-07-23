import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  Settings as SettingsIcon,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  ChevronRight
} from 'lucide-react-native';

const AdminSettings = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    autoNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    maintenanceMode: false,
    dataBackup: true,
    userRegistration: true,
    geoLocation: true,
    analytics: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Deseja exportar todos os dados do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => {
          // Here you would implement data export
          console.log('Exporting data...');
          Alert.alert('Sucesso', 'Dados exportados com sucesso!');
        }}
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Dados',
      'Atenção: Esta ação pode sobrescrever dados existentes. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Importar', style: 'destructive', onPress: () => {
          // Here you would implement data import
          console.log('Importing data...');
          Alert.alert('Sucesso', 'Dados importados com sucesso!');
        }}
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpar Dados',
      'ATENÇÃO: Esta ação irá remover TODOS os dados do sistema permanentemente. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'destructive', onPress: () => {
          Alert.alert(
            'Confirmação Final',
            'Tem certeza absoluta? Todos os dados serão perdidos!',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'SIM, LIMPAR TUDO', style: 'destructive', onPress: () => {
                // Here you would implement data clearing
                console.log('Clearing all data...');
                Alert.alert('Concluído', 'Todos os dados foram removidos.');
              }}
            ]
          );
        }}
      ]
    );
  };

  const handleSystemReset = () => {
    Alert.alert(
      'Reiniciar Sistema',
      'Deseja reiniciar o sistema? Isso pode levar alguns minutos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', onPress: () => {
          // Here you would implement system restart
          console.log('Restarting system...');
          Alert.alert('Sistema', 'Sistema reiniciado com sucesso!');
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
        <Text style={styles.title}>Configurações do Sistema</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell color="#3B82F6" size={20} />
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notificações Automáticas</Text>
            <Switch
              value={settings.autoNotifications}
              onValueChange={(value) => updateSetting('autoNotifications', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={settings.autoNotifications ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alertas por Email</Text>
            <Switch
              value={settings.emailAlerts}
              onValueChange={(value) => updateSetting('emailAlerts', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={settings.emailAlerts ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Alertas por SMS</Text>
            <Switch
              value={settings.smsAlerts}
              onValueChange={(value) => updateSetting('smsAlerts', value)}
              trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
              thumbColor={settings.smsAlerts ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon color="#F59E0B" size={20} />
            <Text style={styles.sectionTitle}>Sistema</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Modo Manutenção</Text>
            <Switch
              value={settings.maintenanceMode}
              onValueChange={(value) => updateSetting('maintenanceMode', value)}
              trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
              thumbColor={settings.maintenanceMode ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Backup Automático</Text>
            <Switch
              value={settings.dataBackup}
              onValueChange={(value) => updateSetting('dataBackup', value)}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor={settings.dataBackup ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* User Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users color="#8B5CF6" size={20} />
            <Text style={styles.sectionTitle}>Usuários</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Permitir Novos Registros</Text>
            <Switch
              value={settings.userRegistration}
              onValueChange={(value) => updateSetting('userRegistration', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor={settings.userRegistration ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Geolocalização Obrigatória</Text>
            <Switch
              value={settings.geoLocation}
              onValueChange={(value) => updateSetting('geoLocation', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
              thumbColor={settings.geoLocation ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield color="#10B981" size={20} />
            <Text style={styles.sectionTitle}>Privacidade & Segurança</Text>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Coleta de Analytics</Text>
            <Switch
              value={settings.analytics}
              onValueChange={(value) => updateSetting('analytics', value)}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor={settings.analytics ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database color="#6B7280" size={20} />
            <Text style={styles.sectionTitle}>Gestão de Dados</Text>
          </View>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
            <Download color="#3B82F6" size={20} />
            <Text style={styles.actionLabel}>Exportar Dados</Text>
            <ChevronRight color="#9CA3AF" size={16} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleImportData}>
            <Upload color="#F59E0B" size={20} />
            <Text style={styles.actionLabel}>Importar Dados</Text>
            <ChevronRight color="#9CA3AF" size={16} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleSystemReset}>
            <RefreshCw color="#8B5CF6" size={20} />
            <Text style={styles.actionLabel}>Reiniciar Sistema</Text>
            <ChevronRight color="#9CA3AF" size={16} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trash2 color="#EF4444" size={20} />
            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Zona de Perigo</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.actionItem, styles.dangerItem]} 
            onPress={handleClearData}
          >
            <Trash2 color="#EF4444" size={20} />
            <Text style={[styles.actionLabel, { color: '#EF4444' }]}>
              Limpar Todos os Dados
            </Text>
            <ChevronRight color="#EF4444" size={16} />
          </TouchableOpacity>
        </View>

        {/* System Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informações do Sistema</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versão:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Última Atualização:</Text>
              <Text style={styles.infoValue}>15/01/2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Servidor:</Text>
              <Text style={styles.infoValue}>Online</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Banco de Dados:</Text>
              <Text style={styles.infoValue}>Conectado</Text>
            </View>
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  dangerItem: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});

export default AdminSettings;