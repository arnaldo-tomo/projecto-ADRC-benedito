import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import ApiService, { CreateReportData } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { validators } from '../../utils/validation';

const NewReportScreen = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState<CreateReportData>({
    type: 'vazamento',
    title: '',
    description: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    photos: [],
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const createReportApi = useApi();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Para uma melhor experiência, permita o acesso à localização.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const formattedAddress = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.district || ''}, ${addr.city || ''}`.trim();
        
        setReportData(prev => ({
          ...prev,
          location: formattedAddress || 'Localização atual',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização atual.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'Permita o acesso à galeria para adicionar fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        if (reportData.photos && reportData.photos.length >= 5) {
          Alert.alert('Limite atingido', 'Você pode adicionar no máximo 5 fotos.');
          return;
        }

        setReportData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), result.assets[0].base64!],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        if (reportData.photos && reportData.photos.length >= 5) {
          Alert.alert('Limite atingido', 'Você pode adicionar no máximo 5 fotos.');
          return;
        }

        setReportData(prev => ({
          ...prev,
          photos: [...(prev.photos || []), result.assets[0].base64!],
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const removePhoto = (index: number) => {
    setReportData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = (): boolean => {
    if (!validators.required(reportData.title)) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return false;
    }

    if (!validators.required(reportData.description)) {
      Alert.alert('Erro', 'A descrição é obrigatória.');
      return false;
    }

    if (!validators.required(reportData.location)) {
      Alert.alert('Erro', 'A localização é obrigatória.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createReportApi.execute(() => ApiService.createReport(reportData));
      
      Alert.alert(
        'Sucesso!',
        'Sua ocorrência foi registrada com sucesso. Nossa equipe irá analisá-la em breve.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating report:', error);
      Alert.alert('Erro', 'Não foi possível registrar a ocorrência. Tente novamente.');
    }
  };

  const reportTypes = [
    { value: 'vazamento', label: 'Vazamento' },
    { value: 'falta_agua', label: 'Falta de Água' },
    { value: 'pressao_baixa', label: 'Pressão Baixa' },
    { value: 'qualidade_agua', label: 'Qualidade da Água' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          disabled={createReportApi.loading}
        >
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
                key={type.value}
                style={[
                  styles.typeButton,
                  reportData.type === type.value && styles.typeButtonActive,
                ]}
                onPress={() => setReportData(prev => ({ ...prev, type: type.value as any }))}
                disabled={createReportApi.loading}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    reportData.type === type.value && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título *</Text>
          <TextInput
            style={styles.textInput}
            value={reportData.title}
            onChangeText={(text) => setReportData(prev => ({ ...prev, title: text }))}
            placeholder="Ex: Vazamento na calçada"
            maxLength={255}
            editable={!createReportApi.loading}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição *</Text>
          <TextInput
            style={styles.textArea}
            value={reportData.description}
            onChangeText={(text) => setReportData(prev => ({ ...prev, description: text }))}
            placeholder="Descreva detalhadamente o problema..."
            multiline
            numberOfLines={4}
            maxLength={1000}
            editable={!createReportApi.loading}
          />
          <Text style={styles.charCount}>
            {reportData.description.length}/1000
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização *</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={styles.locationInput}
              value={reportData.location}
              onChangeText={(text) => setReportData(prev => ({ ...prev, location: text }))}
              placeholder="Digite o endereço ou use localização atual"
              maxLength={500}
              editable={!createReportApi.loading}
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={isLoadingLocation || createReportApi.loading}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="#1E40AF" size="small" />
              ) : (
                <MapPin color="#1E40AF" size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos (Opcional)</Text>
          <Text style={styles.sectionSubtitle}>
            Adicione até 5 fotos para ajudar nossa equipe a entender melhor o problema
          </Text>
          
          {reportData.photos && reportData.photos.length > 0 && (
            <ScrollView horizontal style={styles.photosContainer} showsHorizontalScrollIndicator={false}>
              {reportData.photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${photo}` }}
                    style={styles.photo}
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                    disabled={createReportApi.loading}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              disabled={createReportApi.loading}
            >
              <Camera color="#1E40AF" size={20} />
              <Text style={styles.photoButtonText}>Tirar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.photoButton}
              onPress={pickImage}
              disabled={createReportApi.loading}
            >
              <Camera color="#1E40AF" size={20} />
              <Text style={styles.photoButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              createReportApi.loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createReportApi.loading}
          >
            {createReportApi.loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Send color="#FFFFFF" size={20} />
                <Text style={styles.submitButtonText}>Enviar Ocorrência</Text>
              </>
            )}
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: '#FFFFFF',
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosContainer: {
    marginBottom: 16,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E40AF',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  submitContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
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