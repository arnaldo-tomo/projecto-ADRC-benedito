// app/auth/register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Droplets, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData } from '../../services/api';

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, phone, password, password_confirmation } = formData;
    
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== password_confirmation) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        Alert.alert(
          'Sucesso!',
          'Conta criada com sucesso. Bem-vindo ao AdRC!',
          [{ text: 'OK' }]
        );
        // Não precisa navegar manualmente, o ProtectedRoute cuidará disso
      } else {
        Alert.alert('Erro', result.message || 'Erro ao criar conta. Tente novamente.');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Erro', 'Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <ArrowLeft color="#1F2937" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Criar Conta</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Droplets color="#FFFFFF" size={24} />
            </View>
            <Text style={styles.logoText}>AdRC</Text>
            <Text style={styles.logoSubtext}>Águas da Região Centro</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Crie sua conta</Text>
            <Text style={styles.formSubtitle}>
              Preencha as informações abaixo para se cadastrar
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nome completo *"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                autoComplete="name"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email *"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Phone color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Telefone *"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <MapPin color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Endereço (opcional)"
                value={formData.address}
                onChangeText={(value) => updateFormData('address', value)}
                multiline
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Senha *"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff color="#6B7280" size={20} />
                ) : (
                  <Eye color="#6B7280" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Lock color="#6B7280" size={20} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirmar senha *"
                value={formData.password_confirmation}
                onChangeText={(value) => updateFormData('password_confirmation', value)}
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff color="#6B7280" size={20} />
                ) : (
                  <Eye color="#6B7280" size={20} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInfo}>
              <Text style={styles.passwordInfoText}>
                A senha deve ter pelo menos 6 caracteres
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity 
                onPress={() => router.push('/auth/login')}
                disabled={isLoading}
              >
                <Text style={styles.loginLink}>Fazer login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  logoSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  passwordInfo: {
    marginBottom: 24,
  },
  passwordInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
});

export default RegisterScreen;