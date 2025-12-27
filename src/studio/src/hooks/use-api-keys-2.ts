import { useState, useEffect } from 'react';
import { apiKeysApi } from '@/lib/api/api-keys-2';
import { 
  ApiKey, 
  CreateApiKeyRequest, 
} from '@/lib/types/api-keys-2';
import { toast } from 'sonner';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const data = await apiKeysApi.getApiKeys();
      setApiKeys(data);
      setError(null);
    } catch {
      setError('Failed to fetch ApiKeys');
      toast.error('Failed to fetch ApiKeys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (data: CreateApiKeyRequest) => {
    try {
      const newApiKey = await apiKeysApi.createApiKey(data);
      toast.success('ApiKey created successfully');
      fetchApiKeys(); // Refetch ApiKeys after creation
      return newApiKey;
    } catch (err) {
      toast.error('Failed to create ApiKey');
      throw err;
    }
  };

  const updateApiKey = async (id: string, data: CreateApiKeyRequest) => {
    try {
      const updatedApiKey = await apiKeysApi.updateApiKey(id, data);
      toast.success('ApiKey updated successfully');
      fetchApiKeys(); // Refetch ApiKeys after update
      return updatedApiKey;
    } catch (err) {
      toast.error('Failed to update ApiKey');
      throw err;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiKeysApi.deleteApiKey(id);
      toast.success('ApiKey deleted successfully');
      fetchApiKeys(); // Refetch ApiKeys after deletion
    } catch (err) {
      toast.error('Failed to delete ApiKey');
      throw err;
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    ApiKeys: apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
};