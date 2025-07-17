// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Phone, Mail, MapPin, FileText } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Terminar Sessão',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Suporte Técnico',
      'Entre em contacto connosco através do chat ou ligue para +258 23 323 456',
      [
        { text: 'OK' },
        { text: 'Abrir Chat', onPress: () => router.push('/(tabs)/chat') },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Editar Perfil',
      'Funcionalidade em desenvolvimento. Em breve você poderá editar suas informações.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color="#FFFFFF" size={32} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@email.com'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FileText color="#1E40AF" size={24} />
            <Text style={styles.statNumber}>{user?.total_reports || 0}</Text>
            <Text style={styles.statLabel}>Ocorrências</Text>
          </View>
          <View style={styles.statCard}>
            <Settings color="#10B981" size={24} />
            <Text style={styles.statNumber}>{user?.resolved_reports || 0}</Text>
            <Text style={styles.statLabel}>Resolvidas</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail color="#6B7280" size={20} />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Phone color="#6B7280" size={20} />
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{user?.phone || 'Não informado'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin color="#6B7280" size={20} />
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{user?.address || 'Não informado'}</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Bell color="#6B7280" size={20} />
                <Text style={styles.settingLabel}>Notificações</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#1E40AF' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MapPin color="#6B7280" size={20} />
                <Text style={styles.settingLabel}>Localização</Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#D1D5DB', true: '#1E40AF' }}
                thumbColor={locationEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opções</Text>
          
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuLeft}>
                <Settings color="#6B7280" size={20} />
                <Text style={styles.menuLabel}>Configurações Avançadas</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Shield color="#6B7280" size={20} />
                <Text style={styles.menuLabel}>Privacidade</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
              <View style={styles.menuLeft}>
                <HelpCircle color="#6B7280" size={20} />
                <Text style={styles.menuLabel}>Suporte</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/reports')}>
              <View style={styles.menuLeft}>
                <FileText color="#6B7280" size={20} />
                <Text style={styles.menuLabel}>Minhas Ocorrências</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Info */}
        {user?.created_at && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Conta</Text>
            <View style={styles.accountCard}>
              <Text style={styles.accountLabel}>Membro desde</Text>
              <Text style={styles.accountValue}>
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.accountLabel}>Status da Conta</Text>
              <Text style={[styles.accountValue, styles.statusActive]}>
                {user.status === 'active' ? 'Ativa' : 'Inativa'}
              </Text>
            </View>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Terminar Sessão</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>AdRC App v1.0.0</Text>
          <Text style={styles.versionSubtext}>Águas da Região Centro</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#1E40AF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginLeft: 12,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  accountLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  accountValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    marginBottom: 16,
  },
  statusActive: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
  },
});

export default ProfileScreen;