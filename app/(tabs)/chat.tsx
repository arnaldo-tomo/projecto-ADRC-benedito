import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, MessageCircle, User, Clock } from 'lucide-react-native';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    {
      id: 1,
      text: 'Olá! Como posso ajudá-lo hoje?',
      sender: 'adrc',
      timestamp: '09:30',
      isRead: true,
    },
    {
      id: 2,
      text: 'Bom dia! Reportei um vazamento na minha rua ontem, gostaria de saber o status.',
      sender: 'user',
      timestamp: '09:35',
      isRead: true,
    },
    {
      id: 3,
      text: 'Deixe-me verificar sua ocorrência. Pode me informar o endereço?',
      sender: 'adrc',
      timestamp: '09:37',
      isRead: true,
    },
    {
      id: 4,
      text: 'Rua da Manga, 123 - próximo à escola primária.',
      sender: 'user',
      timestamp: '09:38',
      isRead: true,
    },
    {
      id: 5,
      text: 'Encontrei sua ocorrência! Nossa equipe já foi despachada e deve chegar em aproximadamente 2 horas. Obrigado por reportar!',
      sender: 'adrc',
      timestamp: '09:40',
      isRead: false,
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const renderMessage = (msg: any) => {
    const isUser = msg.sender === 'user';
    
    return (
      <View
        key={msg.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.adrcMessage,
        ]}
      >
        <View style={styles.messageContent}>
          {!isUser && (
            <View style={styles.senderInfo}>
              <View style={styles.adrcAvatar}>
                <MessageCircle color="#FFFFFF" size={16} />
              </View>
              <Text style={styles.senderName}>AdRC Suporte</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.adrcMessageText,
            ]}
          >
            {msg.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{msg.timestamp}</Text>
            {isUser && (
              <View style={styles.messageStatus}>
                {msg.isRead ? (
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
        <View style={styles.statusIndicator}>
          <View style={styles.onlineStatus} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Digite sua mensagem..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send 
              color={message.trim() ? '#FFFFFF' : '#9CA3AF'} 
              size={20} 
            />
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  adrcMessage: {
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
  adrcAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  adrcMessageText: {
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
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
    maxHeight: 100,
    marginRight: 12,
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