import { useState, useEffect, useCallback } from 'react';
import { 
  fetchMcpServers, 
  createMcpServer, 
  updateMcpServer, 
  deleteMcpServer 
} from '@/lib/api/mcp-servers';
import { McpServer, McpServerFormValues } from '@/lib/types/mcp-servers';

export const useMcpServers = () => {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMcpServers();
      setServers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load MCP servers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addServer = async (values: McpServerFormValues) => {
    try {
      const newServer = await createMcpServer(values);
      setServers(prev => [...prev, newServer]);
      return newServer;
    } catch (err) {
      setError('Failed to create server');
      throw err;
    }
  };

  const updateServer = async (id: string, values: McpServerFormValues) => {
    try {
      const updatedServer = await updateMcpServer(id, values);
      setServers(prev => prev.map(s => s.id === id ? updatedServer : s));
      return updatedServer;
    } catch (err) {
      setError('Failed to update server');
      throw err;
    }
  };

  const removeServer = async (id: string) => {
    try {
      await deleteMcpServer(id);
      setServers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError('Failed to delete server');
      throw err;
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    servers,
    loading,
    error,
    addServer,
    updateServer,
    removeServer,
    reload: loadData
  };
};