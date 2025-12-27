// src/lib/api/apps.ts
import { apiClient } from './client';
import { App } from '@/lib/types/apps';

export const appsApi = {
  /**
   * Fetch all apps from the backend
   */
  async getAll(): Promise<App[]> {
    try {
      const response = await apiClient.get<App[]>(`/apps/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch apps:', error);
      throw new Error('Failed to load applications');
    }
  },
  /**
   * Fetch all apps from the backend
   */
  async getAllAgents(): Promise<App[]> {
    try {
      const response = await apiClient.get<App[]>(`/apps/agents/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch apps:', error);
      throw new Error('Failed to load applications');
    }
  },
};