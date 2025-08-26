import { useState, useCallback } from 'react';
import { UseAIAssistantReturn, AIResponse, CallSummary, Task } from '@/types';

import { aiService } from '@/services';
import { useTaskStore } from '@/store';

export const useAI = (): UseAIAssistantReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { addTask } = useTaskStore();

  const sendMessage = useCallback(async (message: string): Promise<AIResponse> => {
    setIsLoading(true);
    try {
      const response = await aiService.generateResponse(message);
      
      if (response.success && response.data) {
        const aiResponse: AIResponse = {
          id: Date.now().toString(),
          query: message,
          response: response.data,
          timestamp: new Date().toISOString(),
          confidence: 0.95, // Mock confidence score
          suggestions: [], // Mock suggestions
        };
        
        setIsLoading(false);
        return aiResponse;
      }
      
      throw new Error('Failed to get AI response');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const getCallSummary = useCallback(async (callId: string): Promise<CallSummary> => {
    setIsLoading(true);
    try {
      // In a real app, you'd get the call transcription first
      const mockTranscription = "Mock call transcription";
      
      const response = await aiService.summarizeCall(mockTranscription);
      
      if (response.success && response.data) {
        const callSummary: CallSummary = {
          id: Date.now().toString(),
          callId,
          summary: response.data.summary,
          keyPoints: response.data.keyPoints,
          actionItems: [], // Will be populated from task extraction
          sentiment: response.data.sentiment,
          topics: response.data.topics,
          duration: 300, // Mock duration
          participants: ['You', 'Contact'],
          createdAt: new Date().toISOString(),
        };
        
        setIsLoading(false);
        return callSummary;
      }
      
      throw new Error('Failed to get call summary');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const generateTasks = useCallback(async (callId: string): Promise<Task[]> => {
    setIsLoading(true);
    try {
      // In a real app, you'd get the call transcription first
      const mockTranscription = "Mock call transcription with action items";
      
      const response = await aiService.extractTasks(mockTranscription);
      
      if (response.success && response.data) {
        const tasks: Task[] = response.data.tasks.map((taskData: Task) => ({
          id: Date.now().toString() + Math.random(),
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          isCompleted: false,
          dueDate: taskData.dueDate,
          createdFrom: 'call' as const,
          sourceId: callId,
          createdAt: new Date().toISOString(),
        }));
        
        // Add tasks to store
        tasks.forEach(task => {
          addTask({
            title: task.title,
            description: task.description,
            priority: task.priority,
            isCompleted: task.isCompleted,
            dueDate: task.dueDate,
            createdFrom: task.createdFrom,
            sourceId: task.sourceId,
          });
        });
        
        setIsLoading(false);
        return tasks;
      }
      
      throw new Error('Failed to generate tasks');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [addTask]);

  const searchConversations = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await aiService.searchConversations(query);
      
      if (response.success) {
        setIsLoading(false);
        return response.data || [];
      }
      
      throw new Error('Failed to search conversations');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return {
    isLoading,
    sendMessage,
    getCallSummary,
    generateTasks,
    searchConversations,
  };
};