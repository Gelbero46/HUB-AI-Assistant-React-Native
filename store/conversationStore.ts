import { create } from 'zustand';
import { ConversationState, Conversation, Message } from '@/types';

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  messages: {},

  addMessage: (message: Message) => {
    const { messages, conversations } = get();
    const conversationMessages = messages[message.conversationId] || [];
    
    set({
      messages: {
        ...messages,
        [message.conversationId]: [message, ...conversationMessages],
      },
    });

    // Update conversation with latest message
    const conversationIndex = conversations.findIndex(
      conv => conv.id === message.conversationId
    );
    
    if (conversationIndex >= 0) {
      const updatedConversations = [...conversations];
      updatedConversations[conversationIndex] = {
        ...updatedConversations[conversationIndex],
        lastMessage: message,
        unreadCount: message.isIncoming 
          ? updatedConversations[conversationIndex].unreadCount + 1
          : updatedConversations[conversationIndex].unreadCount,
        updatedAt: message.timestamp,
      };
      
      set({ conversations: updatedConversations });
    }
  },

  markAsRead: (conversationId: string) => {
    const { conversations } = get();
    set({
      conversations: conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      ),
    });
  },

  updateConversation: (conversationId: string, updates: Partial<Conversation>) => {
    const { conversations } = get();
    set({
      conversations: conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, ...updates }
          : conv
      ),
    });
  },
}));