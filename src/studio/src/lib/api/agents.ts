// lib/api/agents.ts
import { apiClient } from './client';
import { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/agents';

export const agentsApi = {
  async getAll(): Promise<Agent[]> {
    const response = await apiClient.get<Agent[]>('/agents/');
    return response.data;
  },

  async getById(id: string): Promise<Agent> {
    const response = await apiClient.get<Agent>(`/agents/${id}`);
    return response.data;
  },

  async create(data: CreateAgentRequest): Promise<Agent> {
    const response = await apiClient.post<Agent>('/agents', data);
    return response.data;
  },

  async update(id: string, data: UpdateAgentRequest): Promise<Agent> {
    const response = await apiClient.put<Agent>(`/agents/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/agents/${id}`);
  },

  async aiGenerate(user_prompt: string): Promise<Agent> {
    const response = await apiClient.post<Agent>('/agents/ai-generate', { user_prompt });
    return response.data;
  },
};