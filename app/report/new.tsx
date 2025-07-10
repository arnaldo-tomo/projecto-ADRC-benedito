import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Camera, Mic, Send, Droplets, TriangleAlert as AlertTriangle, Navigation, FileText } from 'lucide-react-native';

const NewReportScreen = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('media');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    {
      id: 'vazamento',
      title: 'Vazamento',
      icon: <Droplets color="#3B82F6" size={24} />,
      description: 'Fuga de água em canos, torneiras ou conexões',
    },
    {
      id: 'falta_agua',
      title: 'Falta de Água',
      icon: <AlertTriangle color="#EF4444" size={24} />,
      description: 'Ausência total ou parcial de fornecimento',
    },
    {
      id: 'pressao_baixa',
      title: 'Pressão Baixa',
      icon: <Navigation color="#F59E0B" size={24} />,
      description: 'Fluxo de água insuficiente',
    },
    {
      id: 'qualidade',
      title: 'Qualidade da Água',
      icon: <FileText color="#6B7280" size={24} />,
      description: 'Cor, odor ou sabor anormal',
    },
  ];

  const priorityLevels = [
    { id: 'baixa', label: 'Baixa', color: '#10B981' },
    { id: 'media', label: 'Média', color: '#F59E0B' },
    { id: 'alta', label: 'Alta', color: '#EF4444' },
  ];

  const handleSubmit = async () => {
    if (!selectedType || !description.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Sucesso!',
        'Sua ocorrência foi registrada com sucesso. Você receberá atualizações sobre o progresso.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao enviar sua ocorrência. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    Alert.alert(
      'Localização',
      'Esta funcionalidade usará o GPS do seu dispositivo para obter sua localização atual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'OK', onPress: () => setLocation('Rua da Manga, 123, Beira') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Ocorrência</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Ocorrência *</Text>
          <View style={styles.typeGrid}>
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                {type.icon}
                <Text style={[
                  styles.typeTitle,
                  selectedType === type.id && styles.typeSelectedText
                ]}>
                  {type.title}
                </Text>
                <Text style={[
                  styles.typeDescription,
                  selectedType === type.id && styles.typeSelectedDescription
                ]}>
                  {type.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva detalhadamente o problema..."
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Endereço ou ponto de referência"
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
              <MapPin color="#1E40AF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prioridade</Text>
          <View style={styles.priorityContainer}>
            {priorityLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.priorityButton,
                  priority === level.id && {
                    backgroundColor: level.color + '20',
                    borderColor: level.color,
                  }
                ]}
                onPress={() => setPriority(level.id)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === level.id && { color: level.color }
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anexos (Opcional)</Text>
          <View style={styles.attachmentContainer}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Camera color="#6B7280" size={20} />
              <Text style={styles.attachmentText}>Adicionar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachmentButton}>
              <Mic color="#6B7280" size={20} />
              <Text style={styles.attachmentText}>Gravar Áudio</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedType || !description.trim() || isSubmitting) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedType || !description.trim() || isSubmitting}
        >
          <Send color="#FFFFFF" size={20} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Enviando...' : 'Enviar Ocorrência'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeCardSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EEF2FF',
  },
  typeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  typeSelectedText: {
    color: '#1E40AF',
  },
  typeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  typeSelectedDescription: {
    color: '#1E40AF',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  attachmentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  attachmentButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  attachmentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});

export default NewReportScreen;