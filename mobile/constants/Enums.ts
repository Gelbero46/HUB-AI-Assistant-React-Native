export enum ScreenNames {
  // Auth Stack
  LOGIN = 'Login',
  SIGNUP = 'SignUp',
  ONBOARDING = 'Onboarding',
  
  // Main Tab Navigator
  INBOX = 'Inbox',
  AI_ASSISTANT = 'AIAssistant',
  SEARCH = 'Search',
  TASKS = 'Tasks',
  PROFILE = 'Profile',
  
  // Modal/Stack Screens
  CALL_SCREEN = 'CallScreen',
  CALL_SUMMARY = 'CallSummary',
  CONTACTS = 'Contacts',
  SETTINGS = 'Settings',
  BUSINESS_SETUP = 'BusinessSetup',
}

export enum CallStatus {
  IDLE = 'idle',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  FAILED = 'failed',
}

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  CALL = 'call',
  VOICEMAIL = 'voicemail',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum CallDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}