// src/lib/api/orchestrators.ts
import { apiClient } from './client';
import type { 
  Orchestrator, 
  CreateOrchestratorRequest, 
  UpdateOrchestratorRequest 
} from '../types/orchestrator';

export async function getAllOrchestrators(): Promise<Orchestrator[]> {
  const response = await apiClient.get<Orchestrator[]>('/orchestrators');
  return response.data;
}

export async function getOrchestratorById(id: string): Promise<Orchestrator> {
  const response = await apiClient.get<Orchestrator>(`/orchestrators/${id}`);
  return response.data;
}

export async function createOrchestrator(data: CreateOrchestratorRequest): Promise<Orchestrator> {
  const response = await apiClient.post<Orchestrator>('/orchestrators', data);
  return response.data;
}

export async function updateOrchestrator(id: string, data: UpdateOrchestratorRequest): Promise<Orchestrator> {
  const response = await apiClient.put<Orchestrator>(`/orchestrators/${id}`, data);
  return response.data;
}

export async function deleteOrchestrator(id: string): Promise<void> {
  await apiClient.delete(`/orchestrators/${id}`);
}