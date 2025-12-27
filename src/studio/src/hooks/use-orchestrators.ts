// src/hooks/useOrchestrators.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllOrchestrators, 
  getOrchestratorById, 
  createOrchestrator, 
  updateOrchestrator, 
  deleteOrchestrator 
} from '../lib/api/orchestrators';
import type { 
  Orchestrator, 
  CreateOrchestratorRequest, 
  UpdateOrchestratorRequest 
} from '../lib/types/orchestrator';

export function useOrchestrators() {
  const [orchestrators, setOrchestrators] = useState<Orchestrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrchestrators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllOrchestrators();
      setOrchestrators(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orchestrators');
    } finally {
      setLoading(false);
    }
  };

  const createOrchestratorMutation = async (data: CreateOrchestratorRequest) => {
    try {
      setError(null);
      const newOrchestrator = await createOrchestrator(data);
      setOrchestrators(prev => [...prev, newOrchestrator]);
      return newOrchestrator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create orchestrator';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateOrchestratorMutation = async (id: string, data: UpdateOrchestratorRequest) => {
    try {
      setError(null);
      const updatedOrchestrator = await updateOrchestrator(id, data);
      setOrchestrators(prev => prev.map(o => o.id === id ? updatedOrchestrator : o));
      return updatedOrchestrator;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update orchestrator';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteOrchestratorMutation = async (id: string) => {
    try {
      setError(null);
      await deleteOrchestrator(id);
      setOrchestrators(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete orchestrator';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchOrchestrators();
  }, []);

  return {
    orchestrators,
    loading,
    error,
    refetch: fetchOrchestrators,
    createOrchestrator: createOrchestratorMutation,
    updateOrchestrator: updateOrchestratorMutation,
    deleteOrchestrator: deleteOrchestratorMutation
  };
}

export function useOrchestrator(id: string) {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrchestrator = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getOrchestratorById(id);
      setOrchestrator(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orchestrator');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrchestrator();
  }, [fetchOrchestrator]);

  return {
    orchestrator,
    loading,
    error,
    refetch: fetchOrchestrator
  };
}