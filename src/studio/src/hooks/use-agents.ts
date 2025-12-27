// hooks/useAgents.ts
import { useState, useEffect } from 'react';
import { Agent } from '../lib/types/agents';
import { agentsApi } from '../lib/api/agents';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await agentsApi.getAll();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      await agentsApi.delete(id);
      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete agent');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    deleteAgent,
  };
}