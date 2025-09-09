import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskState, Task } from '@/types';

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        
        const { tasks } = get();
        set({ tasks: [newTask, ...tasks] });
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        const { tasks } = get();
        set({
          tasks: tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        });
      },

      deleteTask: (taskId: string) => {
        const { tasks } = get();
        set({
          tasks: tasks.filter(task => task.id !== taskId),
        });
      },

      toggleTask: (taskId: string) => {
        const { tasks } = get();
        const now = new Date().toISOString();
        
        set({
          tasks: tasks.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  isCompleted: !task.isCompleted,
                  completedAt: !task.isCompleted ? now : undefined,
                }
              : task
          ),
        });
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
