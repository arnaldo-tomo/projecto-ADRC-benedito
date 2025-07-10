import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  MoreVertical,
  X,
  Eye,
  MessageSquare,
  Ban
} from 'lucide-react-native';

const AdminUsers = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+258 84 123 4567',
      address: 'Rua da Manga, 123, Beira',
      joinDate: '2023-05-15',
      lastActive: '2024-01-15 14:30',
      totalReports: 12,
      resolvedReports: 8,
      status: 'active',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+258 84 987 6543',
      address: 'Av. Eduardo Mondlane, 456, Beira',
      joinDate: '2023-08-22',
      lastActive: '2024-01-14 09:15',
      totalReports: 8,
      resolvedReports: 6,
      status: 'active',
    },
    {
      id: 3,
      name: 'Carlos Pereira',
      email: 'carlos.pereira@email.com',
      phone: '+258 84 555 1234',
      address: 'Bairro da Munhava, Beira',
      joinDate: '2023-03-10',
      lastActive: '2024-01-10 16:45',
      totalReports: 15,
      resolvedReports: 13,
      status: 'active',
    },
    {
      id: 4,
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '+258 84 777 8888',
      address: 'Rua das Flores, 789, Beira',
      joinDate: '2023-11-05',
      lastActive: '2024-01-12 08:20',
      totalReports: 5,
      resolvedReports: 4,
      status: 'inactive',
    },
    {
      id: 5,
      name: 'Pedro Machado',
      email: 'pedro.machado@email.com',
      phone: '+258 84 333 2222',
      address: 'Av. das Nações, 321, Beira',
      joinDate: '2023-07-18',
      lastActive: '2023-12-20 11:30',
      totalReports: 3,
      resolvedReports: 2,
      status: 'inactive',
    },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'blocked': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'blocked': return 'Bloqueado';
      default: return 'Desconhecido';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
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
        <Text style={styles.title}>Gerenciar Usuários</Text>
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
            placeholder="Buscar por nome, email, telefone ou endereço..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Usuários</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.filter(u => u.status === 'inactive').length}</Text>
          <Text style={styles.statLabel}>Inativos</Text>
        </View>
      </View>

      {/* Users List */}
      <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                <User color="#FFFFFF" size={20} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View 
                    style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(user.status) + '20' }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.statusText, 
                        { color: getStatusColor(user.status) }
                      ]}
                    >
                      {getStatusText(user.status)}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => setSelectedUser(user)}
              >
                <Eye color="#6B7280" size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.userDetails}>
              <View style={styles.detailRow}>
                <Phone color="#6B7280" size={14} />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin color="#6B7280" size={14} />
                <Text style={styles.detailText}>{user.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar color="#6B7280" size={14} />
                <Text style={styles.detailText}>
                  Membro desde {formatDate(user.joinDate)}
                </Text>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.userStatItem}>
                <Text style={styles.userStatNumber}>{user.totalReports}</Text>
                <Text style={styles.userStatLabel}>Ocorrências</Text>
              </View>
              <View style={styles.userStatItem}>
                <Text style={styles.userStatNumber}>{user.resolvedReports}</Text>
                <Text style={styles.userStatLabel}>Resolvidas</Text>
              </View>
              <View style={styles.userStatItem}>
                <Text style={styles.userStatNumber}>
                  {user.totalReports > 0 ? Math.round((user.resolvedReports / user.totalReports) * 100) : 0}%
                </Text>
                <Text style={styles.userStatLabel}>Taxa Resolução</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* User Details Modal */}
      <Modal
        visible={!!selectedUser}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedUser(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedUser && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes do Usuário</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setSelectedUser(null)}
                  >
                    <X color="#6B7280" size={24} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.userProfileSection}>
                    <View style={styles.userAvatarLarge}>
                      <User color="#FFFFFF" size={32} />
                    </View>
                    <Text style={styles.userNameLarge}>{selectedUser.name}</Text>
                    <View 
                      style={[
                        styles.statusBadgeLarge, 
                        { backgroundColor: getStatusColor(selectedUser.status) + '20' }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.statusTextLarge, 
                          { color: getStatusColor(selectedUser.status) }
                        ]}
                      >
                        {getStatusText(selectedUser.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Informações de Contato</Text>
                    <View style={styles.detailItem}>
                      <Mail color="#6B7280" size={16} />
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{selectedUser.email}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Phone color="#6B7280" size={16} />
                      <Text style={styles.detailLabel}>Telefone:</Text>
                      <Text style={styles.detailValue}>{selectedUser.phone}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MapPin color="#6B7280" size={16} />
                      <Text style={styles.detailLabel}>Endereço:</Text>
                      <Text style={styles.detailValue}>{selectedUser.address}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Atividade</Text>
                    <View style={styles.detailItem}>
                      <Calendar color="#6B7280" size={16} />
                      <Text style={styles.detailLabel}>Membro desde:</Text>
                      <Text style={styles.detailValue}>{formatDate(selectedUser.joinDate)}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Calendar color="#6B7280" size={16} />
                      <Text style={styles.detailLabel}>Último acesso:</Text>
                      <Text style={styles.detailValue}>{formatDateTime(selectedUser.lastActive)}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Estatísticas</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemNumber}>{selectedUser.totalReports}</Text>
                        <Text style={styles.statItemLabel}>Total Ocorrências</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemNumber}>{selectedUser.resolvedReports}</Text>
                        <Text style={styles.statItemLabel}>Resolvidas</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statItemNumber}>
                          {selectedUser.totalReports - selectedUser.resolvedReports}
                        </Text>
                        <Text style={styles.statItemLabel}>Pendentes</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.actionButtonModal}>
                    <MessageSquare color="#3B82F6" size={16} />
                    <Text style={styles.actionButtonText}>Enviar Mensagem</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButtonModal, styles.actionButtonDanger]}>
                    <Ban color="#EF4444" size={16} />
                    <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
                      Bloquear
                    </Text>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  usersList: {
    flex: 1,
    padding: 20,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  userDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  userStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 16,
  },
  userStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  userStatNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  userStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
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
  userProfileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userNameLarge: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTextLarge: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  statItemNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  statItemLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButtonModal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    gap: 8,
  },
  actionButtonDanger: {
    backgroundColor: '#FEF2F2',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  actionButtonTextDanger: {
    color: '#EF4444',
  },
});

export default AdminUsers;