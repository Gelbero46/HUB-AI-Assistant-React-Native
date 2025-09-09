import { Voice } from '@twilio/voice-react-native-sdk';
import { TwilioCall, TranscriptResponse, CallHistoryResponse } from '@/types';
import { CallStatus } from '@/constants';

interface AccessTokenResponse {
  accessToken: string;
  identity: string;
}

interface CallEventListeners {
  onConnected?: () => void;
  onConnecting?: () => void;
  onDisconnected?: () => void;
  onReconnecting?: () => void;
  onReconnected?: () => void;
  onError?: (error: any) => void;
}

interface TwilioServiceConfig {
  serverUrl: string;
  identity?: string;
  retryAttempts?: number;
  tokenRefreshThreshold?: number; // minutes before expiry to refresh
}

class TwilioService {
  private voice: Voice;
  private activeCall: TwilioCall | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private isInitialized: boolean = false;
  private serverUrl: string = '';
  private userIdentity: string = '';
  private retryAttempts: number = 3;
  private tokenRefreshThreshold: number = 5; // minutes
  private eventListeners: CallEventListeners = {};

  constructor() {
    this.voice = new Voice();
  }

  async initialize(config: TwilioServiceConfig): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      this.serverUrl = config.serverUrl;
      this.userIdentity = config.identity || `user_${Date.now()}`;
      this.retryAttempts = config.retryAttempts || 3;
      this.tokenRefreshThreshold = config.tokenRefreshThreshold || 5;
      
      // Set up voice event listeners
    //   this.voice.on('registered', () => {
    //     console.log('Twilio Voice registered successfully');
    //   });

    //   this.voice.on('unregistered', () => {
    //     console.log('Twilio Voice unregistered');
    //   });

    //   this.voice.on('error', (error: any) => {
    //     console.error('Twilio Voice error:', error);
    //     this.eventListeners.onError?.(error);
    //   });

    //   this.voice.on('call', (call: TwilioCall) => {
    //     console.log('Call received:', call);
    //     this.activeCall = call;
    //     this.setupCallListeners(call);
    //   });

      this.voice.on('callInvite', (callInvite) => {
        console.log('Incoming call invite:', callInvite);
        const call = callInvite.accept();

        this.activeCall = call;
        this.setupCallListeners(call);
      });

      this.isInitialized = true;
      return true;

    } catch (error) {
      console.error('Failed to initialize Twilio Voice:', error);
      return false;
    }
  }

  setEventListeners(listeners: CallEventListeners): void {
    this.eventListeners = { ...this.eventListeners, ...listeners };
  }

  private setupCallListeners(call: TwilioCall): void {
    call.on('connected', () => {
      console.log('Call connected');
      this.eventListeners.onConnected?.();
    });

    call.on('connecting', () => {
      console.log('Call connecting');
      this.eventListeners.onConnecting?.();
    });

    call.on('disconnected', () => {
      console.log('Call disconnected');
      this.activeCall = null;
      this.eventListeners.onDisconnected?.();
    });

    call.on('reconnecting', () => {
      console.log('Call reconnecting');
      this.eventListeners.onReconnecting?.();
    });

    call.on('reconnected', () => {
      console.log('Call reconnected');
      this.eventListeners.onReconnected?.();
    });

    call.on('error', (error: any) => {
      console.error('Call error:', error);
      this.eventListeners.onError?.(error);
    });
  }

  private async retryOperation<T>(
    operation: () => Promise<T>, 
    attempts: number = this.retryAttempts
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < attempts - 1) {
          const delay = Math.pow(2, i) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    const now = new Date();
    const threshold = new Date(this.tokenExpiry.getTime() - this.tokenRefreshThreshold * 60 * 1000);
    return now >= threshold;
  }

  async getAccessToken(forceRefresh: boolean = false): Promise<string> {
    try {
      if (!forceRefresh && this.accessToken && !this.isTokenExpired()) {
        return this.accessToken;
      }

      const response = await this.retryOperation(async () => {
        const res = await fetch(`${this.serverUrl}/api/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ identity: this.userIdentity }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to get access token');
        }

        return res;
      });

      const data: AccessTokenResponse = await response.json();
      this.accessToken = data.accessToken;
      
      // Set token expiry (assuming JWT with standard exp claim)
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        if (payload.exp) {
          this.tokenExpiry = new Date(payload.exp * 1000);
        }
      } catch (e) {
        // If we can't parse the token, set a default expiry
        this.tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      }

      return data.accessToken;

    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async register(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      await this.voice.register(token);
      return true;
    } catch (error) {
      console.error('Failed to register with Twilio:', error);
      throw error;
    }
  }

  async unregister(): Promise<boolean> {
    try {
      if (this.isInitialized) {
        await this.voice.unregister(this.accessToken as string);
        this.accessToken = null;
        this.tokenExpiry = null;
      }
      return true;
    } catch (error) {
      console.error('Failed to unregister:', error);
      throw error;
    }
  }

  async makeCall(
    phoneNumber: string, 
    contactId?: string,
    customParams?: Record<string, string>
  ): Promise<TwilioCall> {
    try {
      // Ensure we have a valid token
      const token = await this.getAccessToken();

      console.log(`Making call to ${phoneNumber}`);

      const params = {
        To: phoneNumber,
        From: this.userIdentity,
        contactId: contactId || phoneNumber,
        ...customParams
      };

      const call = await this.voice.connect(token, { params });

      this.activeCall = call;
      this.setupCallListeners(call);
      
      return call;

    } catch (error) {
      console.error('Error making call:', error);
      throw error;
    }
  }

  async endCall(): Promise<boolean> {
    try {
      if (this.activeCall) {
        this.activeCall.disconnect();
        this.activeCall = null;
      }
      return true;
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  async sendDTMF(digits: string): Promise<boolean> {
    try {
      if (this.activeCall) {
        this.activeCall.sendDigits(digits);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending DTMF:', error);
      return false;
    }
  }

  async toggleMute(): Promise<boolean> {
    try {
      if (this.activeCall) {
        const isMuted = this.activeCall.isMuted();
        this.activeCall.mute(!isMuted);
        return !isMuted;
      }
      return false;
    } catch (error) {
      console.error('Error toggling mute:', error);
      return false;
    }
  }

  async toggleSpeaker(): Promise<boolean> {
    try {
      if (this.activeCall) {
        const isSpeakerOn = this.activeCall.isSpeakerOn();
        this.activeCall.setSpeaker(!isSpeakerOn);
        return !isSpeakerOn;
      }
      return false;
    } catch (error) {
      console.error('Error toggling speaker:', error);
      return false;
    }
  }

  async toggleHold(): Promise<boolean> {
    try {
      if (this.activeCall) {
        const isOnHold = this.activeCall.isOnHold();
        this.activeCall.setOnHold(!isOnHold);
        return !isOnHold;
      }
      return false;
    } catch (error) {
      console.error('Error toggling hold:', error);
      return false;
    }
  }

  getCallStatus(): CallStatus {
    if (!this.activeCall) return CallStatus.IDLE;
    
    switch (this.activeCall.getState()) {
      case 'connecting':
        return CallStatus.CONNECTING;
      case 'connected':
        return CallStatus.CONNECTED;
      case 'disconnected':
        return CallStatus.DISCONNECTED;
      case 'failed':
        return CallStatus.FAILED;
      default:
        return CallStatus.IDLE;
    }
  }

  getCallDuration(): number {
    if (!this.activeCall) return 0;
    return this.activeCall.getDuration() || 0;
  }

  isCallActive(): boolean {
    return this.activeCall !== null && this.getCallStatus() !== CallStatus.DISCONNECTED;
  }

  isCallMuted(): boolean {
    return this.activeCall?.isMuted() || false;
  }

  isSpeakerOn(): boolean {
    return this.activeCall?.isSpeakerOn() || false;
  }

  isOnHold(): boolean {
    return this.activeCall?.isOnHold() || false;
  }

  getActiveCall(): TwilioCall | null {
    return this.activeCall;
  }

  async getCallTranscript(callSid: string): Promise<TranscriptResponse> {
    try {
      const response = await this.retryOperation(async () => {
        const res = await fetch(`${this.serverUrl}/api/transcript/${callSid}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to get transcript');
        }

        return res;
      });

      const data: TranscriptResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting transcript:', error);
      throw error;
    }
  }

  async getUserCalls(limit?: number, offset?: number): Promise<CallHistoryResponse> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      
      const url = `${this.serverUrl}/api/calls/${this.userIdentity}${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await this.retryOperation(async () => {
        const res = await fetch(url);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to get call history');
        }

        return res;
      });

      const data: CallHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting call history:', error);
      throw error;
    }
  }

  getUserIdentity(): string {
    return this.userIdentity;
  }

  getServerUrl(): string {
    return this.serverUrl;
  }

  isRegistered(): boolean {
    return this.isInitialized && this.accessToken !== null;
  }

  // Cleanup method for proper resource management
  async cleanup(): Promise<void> {
    try {
      await this.endCall();
      await this.unregister();
      this.isInitialized = false;
      this.eventListeners = {};
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.serverUrl}/api/health`, {
        method: 'GET',
        // timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default new TwilioService();