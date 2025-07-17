// app/(tabs)/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, MessageCircle, User, Clock, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import apiService, { ChatMessage } from '../../services/api';

const ChatScreen = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatMessages();
    loadUnreadCount();
    
    // Auto-refresh messages every 10 seconds
    const interval = setInterval(() => {
      loadChatMessages();
      loadUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when component mounts and when new messages arrive
    if (messages.length > 0 && !loading) {
      markMessagesAsRead();
    }
  }, [messages, loading]);

  const loadChatMessages = async () => {
    try {
      setError(null);
      const response = await apiService.getChatMessages();
      
      if (response.success) {
        setMessages(response.data);
      } else {
        setError('Erro ao carregar mensagens');
      }
    } catch (error: any) {
      console.error('Error loading chat messages:', error);
      setError('Erro ao carregar mensagens. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadMessagesCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.warn('Could not load unread count:', error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await apiService.markMessagesAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.warn('Could not mark messages as read:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChatMessages();
    await loadUnreadCount();
    setRefreshing(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    const messageText = message.trim();
    setMessage('');
    setSending(true);

    try {
      const response = await apiService.sendMessage(messageText);
      
      if (response.success) {
        // Add the new message to the list
        setMessages(prev => [...prev, response.data]);
        
        // Refresh to get any admin responses
        setTimeout(() => {
          loadChatMessages();
        }, 1000);
      } else {
        Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
        setMessage(messageText); // Restore message if failed
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      Alert.alert('Erro', 'Erro de conexão. Tente novamente.');
      setMessage(messageText); // Restore message if failed
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'Ontem';
    } else if (days < 7) {
      return `${days} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.sender_type === 'user';
    const isCurrentUser = isUser && msg.user?.id === user?.id;
    
    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.userMessage : styles.adminMessage,
        ]}
      >
        <View style={styles.messageContent}>
          {!isCurrentUser && (
            <View style={styles.senderInfo}>
              <View style={styles.adminAvatar}>
                {msg.sender_type === 'admin' ? (
                  <MessageCircle color="#FFFFFF" size={16} />
                ) : (
                  <User color="#FFFFFF" size={16} />
                )}
              </View>
              <Text style={styles.senderName}>
                {msg.sender_type === 'admin' ? 'AdRC Suporte' : (msg.user?.name || 'Usuário')}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.userBubble : styles.adminBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.userMessageText : styles.adminMessageText,
              ]}
            >
              {msg.message}
            </Text>
          </View>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {formatMessageTime(msg.created_at)}
            </Text>
            {isCurrentUser && (
              <View style={styles.messageStatus}>
                {msg.is_read ? (
                  <Text style={styles.readStatus}>✓✓</Text>
                ) : (
                  <Text style={styles.sentStatus}>✓</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const retryLoad = () => {
    setLoading(true);
    loadChatMessages();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Carregando conversa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerAvatar}>
            <MessageCircle color="#FFFFFF" size={24} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>AdRC Suporte</Text>
            <Text style={styles.headerSubtitle}>Águas da Região Centro</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#1E40AF" />
            ) : (
              <Text style={styles.refreshText}>↻</Text>
            )}
          </TouchableOpacity>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <AlertTriangle color="#EF4444" size={24} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={retryLoad}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Welcome Message */}
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIcon}>
                <MessageCircle color="#1E40AF" size={32} />
              </View>
              <Text style={styles.welcomeTitle}>
                Olá, {user?.name || 'Cidadão'}!
              </Text>
              <Text style={styles.welcomeMessage}>
                Esta é sua conversa com a equipe de suporte da AdRC. 
                Estamos aqui para ajudar com suas dúvidas e ocorrências.
              </Text>
            </View>

            {/* Messages */}
            {messages.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MessageCircle color="#9CA3AF" size={48} />
                <Text style={styles.emptyTitle}>Nenhuma mensagem ainda</Text>
                <Text style={styles.emptyText}>
                  Inicie uma conversa com nossa equipe de suporte.
                </Text>
              </View>
            ) : (
              messages.map(renderMessage)
            )}

            {/* Typing Indicator */}
            {sending && (
              <View style={styles.typingContainer}>
                <View style={styles.userAvatar}>
                  <User color="#FFFFFF" size={16} />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={[styles.typingDot, styles.typingDot1]} />
                    <View style={[styles.typingDot, styles.typingDot2]} />
                    <View style={[styles.typingDot, styles.typingDot3]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Digite sua mensagem..."
            multiline
            maxLength={1000}
            editable={!sending}
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() && !sending ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#9CA3AF" />
            ) : (
              <Send 
                color={message.trim() ? '#FFFFFF' : '#9CA3AF'} 
                size={20} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  adminMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adminAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#1E40AF',
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  adminMessageText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  messageStatus: {
    marginLeft: 8,
  },
  readStatus: {
    fontSize: 12,
    color: '#10B981',
  },
  sentStatus: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  typingDot1: {},
  typingDot2: {},
  typingDot3: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 120,
    marginRight: 12,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1E40AF',
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
});

export default ChatScreen;