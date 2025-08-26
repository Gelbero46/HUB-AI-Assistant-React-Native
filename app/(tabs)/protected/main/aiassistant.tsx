import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Header, LoadingSpinner } from '@/components';
import { useAI } from '@/hooks';
import { AIResponse } from '@/types';
import { useTheme } from '@react-navigation/native';
import { Send, Phone, CheckSquare, Search } from 'lucide-react-native';
import createStyles from '@/constants/styles/AIAssistantScreenStyle';
import { Colors } from '@/constants';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

const AIAssistantScreen: React.FC = () => {
  const { colors, fonts: Fonts } = useTheme();
  const styles = useMemo(() => createStyles({ colors, Fonts }), [colors, Fonts]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm M1, your AI assistant. I can help you with call summaries, task management, and answering questions about your business communications. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const { sendMessage, isLoading } = useAI();
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Scroll to bottom immediately after adding user message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    try {
      const aiResponse: AIResponse = await sendMessage(inputText.trim());

      const assistantMessage: Message = {
        id: aiResponse.id,
        text: aiResponse.response,
        isUser: false,
        timestamp: aiResponse.timestamp,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  const quickActions = [
    { id: '1', title: 'Summarize recent calls', icon: <Phone size={18} color={colors.primary} /> },
    { id: '2', title: 'Show my tasks', icon: <CheckSquare size={18} color={Colors.success} /> },
    { id: '3', title: 'Search conversations', icon: <Search size={18} color={colors.notification} /> },
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputText(action.title);
  };

  return (
    <View style={styles.container}>
      <Header title="AI Assistant" />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              style={styles.messagesList}
              contentContainerStyle={{ 
                flexGrow: 1, 
                paddingBottom: 20,
                paddingTop: 10 
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }}
              onContentSizeChange={() => {
                // Auto scroll when content size changes (new messages)
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />

            {messages.length === 1 && (
              <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>Quick Actions</Text>
                {quickActions.map(action => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction(action)}
                  >
                    {action.icon}
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.inputContainer}>
          {isLoading && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>M1 is typing...</Text>
              <LoadingSpinner size="small" />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor={colors.text}
              multiline
              maxLength={500}
              editable={!isLoading}
              onFocus={() => {
                // Scroll to bottom when input is focused
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIAssistantScreen;