import { CallDirection, CallStatus, MessageType, TaskPriority } from '../constants/Enums';
import { Theme as NavigationTheme,  } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';


// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessName?: string;
  avatar?: string;
  isBusinessSetup: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description?: string;
  workingHours?: WorkingHours;
  greetingMessage?: string;
  voicemailMessage?: string;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

// Contact Types
export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatar?: string;
  company?: string;
  notes?: string;
  tags?: string[];
  lastInteraction?: string;
  createdAt: string;
}

// Message and Conversation Types
export interface Message {
  id: string;
  conversationId: string;
  type: MessageType;
  content: string;
  timestamp: string;
  isIncoming: boolean;
  contactId?: string;
  isRead: boolean;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  duration?: number; // for voice messages/calls
  transcription?: string;
  summary?: string;
  callQuality?: number;
  recordingUrl?: string;
}

export interface Conversation {
  id: string;
  contactId: string;
  contact: Contact;
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
  isPinned: boolean;
  tags?: string[];
}

// Call Types
export interface Call {
  id: string;
  contactId: string;
  contact: Contact;
  direction: CallDirection;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  isAnswered: boolean;
  recordingUrl?: string;
  transcription?: string;
  summary?: string;
  aiNotes?: string;
  tasks?: Task[];
  quality?: number;
}

// AI Assistant Types
export interface AIResponse {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  context?: string;
  confidence?: number;
  suggestions?: string[];
}

export interface CallSummary {
  id: string;
  callId: string;
  summary: string;
  keyPoints: string[];
  actionItems: Task[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
  duration: number;
  participants: string[];
  createdAt: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  isCompleted: boolean;
  dueDate?: string;
  createdFrom: 'call' | 'message' | 'manual';
  sourceId?: string; // callId or messageId
  contactId?: string;
  createdAt: string;
  completedAt?: string;
}

// Search Types
export interface SearchResult {
  id: string;
  type: 'call' | 'message' | 'contact' | 'task';
  title: string;
  subtitle: string;
  timestamp: string;
  relevanceScore: number;
  highlight?: string;
}

export interface SearchFilters {
  type?: ('call' | 'message' | 'contact' | 'task')[];
  dateRange?: {
    start: string;
    end: string;
  };
  contacts?: string[];
  tags?: string[];
}

// Notification Types
export interface NotificationPayload {
  id: string;
  type: 'call' | 'message' | 'task' | 'reminder';
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  Onboarding: undefined;
  CallScreen: {
    contactId?: string;
    phoneNumber: string;
  };
  CallSummary: {
    callId: string;
  };
  Contacts: undefined;
  Settings: undefined;
  BusinessSetup: {
    isInitialSetup?: boolean;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Onboarding: undefined;
};

export type MainTabsParamList = {
  Inbox: undefined;
  AIAssistant: undefined;
  Search: undefined;
  Tasks: undefined;
  Profile: undefined;
  Dial: undefined;
};

// Hook Types
export interface UseCallReturn {
  isConnected: boolean;
  isConnecting: boolean;
  currentCall: Call | null;
  makeCall: (phoneNumber: string, contactId?: string) => Promise<void>;
  endCall: () => void;
  answerCall: () => void;
  rejectCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  isMuted: boolean;
  isSpeakerOn: boolean;
}

export interface UseAIAssistantReturn {
  isLoading: boolean;
  sendMessage: (message: string) => Promise<AIResponse>;
  getCallSummary: (callId: string) => Promise<CallSummary>;
  generateTasks: (callId: string) => Promise<Task[]>;
  searchConversations: (query: string) => Promise<SearchResult[]>;
}

// Store Types (for Zustand)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export interface CallState {
  calls: Call[];
  currentCall: Call | null;
  isConnected: boolean;
  addCall: (call: Call) => void;
  updateCall: (callId: string, updates: Partial<Call>) => void;
  setCurrentCall: (call: Call | null) => void;
}

export interface ConversationState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  addMessage: (message: Message) => void;
  markAsRead: (conversationId: string) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
}

export interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
}

// Component Props Types
export interface BaseComponentProps {
  style?: any;
  testID?: string;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  onBackPress?: () => void;
}

export interface FontConfig {
  regular: string;
  medium: string;
  semiBold: string;
  bold: string;
}

export interface MyTheme extends NavigationTheme {
  colors: NavigationTheme['colors'] & {
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    userMessage: string;
    aiMessage: string;
    incoming: string;
    outgoing: string;
    missed: string;
    shadow: string;
  };
  fonts:  {
    regular: string;
    medium: string;
    bold: string;
    semiBold: string;
  };
  sizes: typeof Sizes;
}