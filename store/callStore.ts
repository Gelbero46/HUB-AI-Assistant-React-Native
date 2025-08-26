import { create } from 'zustand';
import { CallState, Call } from '@/types';

export const useCallStore = create<CallState>((set, get) => ({
  calls: [],
  currentCall: null,
  isConnected: false,

  addCall: (call: Call) => {
    const { calls } = get();
    set({ calls: [call, ...calls] });
  },

  updateCall: (callId: string, updates: Partial<Call>) => {
    const { calls } = get();
    set({
      calls: calls.map(call =>
        call.id === callId ? { ...call, ...updates } : call
      ),
    });
  },

  setCurrentCall: (call: Call | null) => {
    set({ 
      currentCall: call,
      isConnected: call !== null,
    });
  },
}));
