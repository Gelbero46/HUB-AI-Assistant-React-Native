import { useState, useEffect, useCallback } from 'react';
import twilioService from '@/services/twilioService';
import { 
  CallRecord, 
  TranscriptResponse, 
  CallHistoryItem,
  TwilioCall 
} from '@/types'
import { CallStatus } from '@/constants';

const SERVER_URL = 'http://your-ngrok-url.ngrok.app'; // Update with your ngrok URL

interface UseCallReturn {
  // Call state
  currentCall: CallRecord | null;
  callStatus: CallStatus;
  isMuted: boolean;
  isSpeakerOn: boolean;
  error: string | null;
  isInitialized: boolean;

  // Call actions
  makeCall: (phoneNumber: string, contactId?: string) => Promise<TwilioCall>;
  endCall: () => Promise<boolean>;
  toggleMute: () => Promise<boolean>;
  toggleSpeaker: () => Promise<boolean>;

  // Transcript functions
  getCallTranscript: (callSid: string) => Promise<TranscriptResponse>;
  getCallHistory: () => Promise<CallHistoryItem[]>;

  // Utility
  clearError: () => void;
}

export const useCall = (): UseCallReturn => {
  const [currentCall, setCurrentCall] = useState<CallRecord | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.IDLE);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize Twilio service
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        await twilioService.initialize({
            serverUrl: SERVER_URL
        });
        await twilioService.register();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Twilio service:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize voice service';
        setError("Failed to initialize voice service");
      }
    };

    initialize();
  }, []);

  // Poll for call status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const status = twilioService.getCallStatus();
      const activeCall = twilioService.getActiveCall();
      
      setCallStatus(status);
      setCurrentCall(activeCall ? {
        sid: activeCall.getSid ? activeCall.getSid() : null,
        status: status,
        contact: {
          name: activeCall.params?.contactId || 'Unknown',
          phoneNumber: activeCall.params?.To || ''
        }
      } : null);

      // Update mute and speaker states
      if (activeCall) {
        try {
          setIsMuted(activeCall.isMuted ? activeCall.isMuted() : false);
          setIsSpeakerOn(activeCall.isSpeakerOn ? activeCall.isSpeakerOn() : false);
        } catch (error) {
          console.warn('Error getting call state:', error);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const makeCall = useCallback(async (phoneNumber: string, contactId?: string): Promise<TwilioCall> => {
    try {
      setError(null);
      
      if (!isInitialized) {
        throw new Error('Voice service not initialized');
      }

      const call = await twilioService.makeCall(phoneNumber, contactId);
      
      setCurrentCall({
        sid: call.getSid ? call.getSid() : null,
        status: CallStatus.CONNECTING,
        contact: {
          name: contactId || phoneNumber,
          phoneNumber: phoneNumber
        }
      });
      
      return call;
    } catch (error) {
      console.error('Failed to make call:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to make call';
      setError(errorMessage);
      throw error;
    }
  }, [isInitialized]);

  const endCall = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      await twilioService.endCall();
      setCurrentCall(null);
      setCallStatus(CallStatus.IDLE);
      setIsMuted(false);
      setIsSpeakerOn(false);
      return true;
    } catch (error) {
      console.error('Failed to end call:', error);
      setError('Failed to end call');
      return false;
    }
  }, []);

  const toggleMute = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const newMuteState = await twilioService.toggleMute();
      setIsMuted(newMuteState);
      return newMuteState;
    } catch (error) {
      console.error('Failed to toggle mute:', error);
      setError('Failed to toggle mute');
      return isMuted;
    }
  }, [isMuted]);

  const toggleSpeaker = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const newSpeakerState = await twilioService.toggleSpeaker();
      setIsSpeakerOn(newSpeakerState);
      return newSpeakerState;
    } catch (error) {
      console.error('Failed to toggle speaker:', error);
      setError('Failed to toggle speaker');
      return isSpeakerOn;
    }
  }, [isSpeakerOn]);

  const getCallTranscript = useCallback(async (callSid: string): Promise<TranscriptResponse> => {
    try {
      setError(null);
      const transcript = await twilioService.getCallTranscript(callSid);
      return transcript;
    } catch (error) {
      console.error('Failed to get transcript:', error);
      setError('Failed to get transcript');
      throw error;
    }
  }, []);

  const getCallHistory = useCallback(async (): Promise<CallHistoryItem[]> => {
    try {
      setError(null);
      const response = await twilioService.getUserCalls();
      return response.calls;
    } catch (error) {
      console.error('Failed to get call history:', error);
      setError('Failed to get call history');
      throw error;
    }
  }, []);

  return {
    // Call state
    currentCall,
    callStatus,
    isMuted,
    isSpeakerOn,
    error,
    isInitialized,

    // Call actions
    makeCall,
    endCall,
    toggleMute,
    toggleSpeaker,

    // Transcript functions
    getCallTranscript,
    getCallHistory,

    // Utility
    clearError: () => setError(null),
  };
};

// Export types and enums for use in components
export { CallStatus };
export type { CallRecord, TranscriptResponse, CallHistoryItem };