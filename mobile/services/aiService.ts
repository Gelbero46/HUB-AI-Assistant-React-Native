import { APIResponse } from '../types';
import { apiClient } from './api';

export interface AITranscriptionResponse {
  transcription: string;
  confidence: number;
  duration: number;
}

export interface AISummaryResponse {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  topics: string[];
}

export interface AITaskExtractionResponse {
  tasks: Array<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
  }>;
}

class AIService {
  async transcribeCall(audioUrl: string): Promise<APIResponse<AITranscriptionResponse>> {
    return apiClient.post<AITranscriptionResponse>('/ai/transcribe', {
      audioUrl,
    });
  }

  async summarizeCall(transcription: string): Promise<APIResponse<AISummaryResponse>> {
    return apiClient.post<AISummaryResponse>('/ai/summarize', {
      transcription,
    });
  }

  async extractTasks(transcription: string): Promise<APIResponse<AITaskExtractionResponse>> {
    return apiClient.post<AITaskExtractionResponse>('/ai/extract-tasks', {
      transcription,
    });
  }

  async searchConversations(query: string): Promise<APIResponse<any[]>> {
    return apiClient.get(`/ai/search?q=${encodeURIComponent(query)}`);
  }

  async generateResponse(message: string, context?: string): Promise<APIResponse<string>> {
    return apiClient.post<string>('/ai/generate-response', {
      message,
      context,
    });
  }
}

export const aiService = new AIService();