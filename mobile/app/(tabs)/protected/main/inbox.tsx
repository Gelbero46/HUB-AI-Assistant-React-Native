import { CallCard, EmptyState, Header, LoadingSpinner } from '@/components';
import { Sizes } from '@/constants';
import { useTheme } from "@/context/theme-context";
import { useCallStore, useConversationStore } from '@/store';
import { Call, Conversation } from '@/types';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

const InboxScreen: React.FC = () => {

  const { colors: Colors, theme } = useTheme();
  const { calls } = useCallStore();
  const { conversations } = useConversationStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memorized style
  const styles = React.useMemo( () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  conversationCard: {
    padding: Sizes.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  }), [Colors]);

  // Combine and sort calls and conversations by timestamp
  const inboxItems = React.useMemo(() => {
    const allItems = [
      ...calls.map(call => ({ type: 'call' as const, data: call, timestamp: call.startTime })),
      ...conversations.map(conv => ({ type: 'conversation' as const, data: conv, timestamp: conv.updatedAt })),
    ];
    
    return allItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [calls, conversations]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const handleCallPress = (call: Call) => {
    // Navigate to call summary or details
    console.log('Call pressed:', call.id);
  };

  const handleConversationPress = (conversation: Conversation) => {
    // Navigate to conversation detail
    console.log('Conversation pressed:', conversation.id);
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'call') {
      return (
        <CallCard
          call={item.data}
          onPress={() => handleCallPress(item.data)}
        />
      );
    }
    
    // Render conversation card (simplified for now)
    return (
      <View style={styles.conversationCard}>
        {/* Conversation card implementation */}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Inbox" />
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title="Inbox"
        rightAction={{
          icon: '🔍',
          onPress: () => console.log('Search pressed'),
        }}
      />
      
      {inboxItems.length === 0 ? (
        <EmptyState
          icon="📥"
          title="Your inbox is empty"
          subtitle="Start making calls or receiving messages to see them here."
        />
      ) : (
        <FlatList
          data={inboxItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default InboxScreen;
