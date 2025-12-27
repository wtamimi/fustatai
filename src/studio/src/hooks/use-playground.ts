// src/hooks/useApps.ts
import { useState, useEffect } from 'react';
import { App } from '@/lib/types/apps';
import { appsApi } from '@/lib/api/apps';

interface UseAppsReturn {
  apps: App[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApps(): UseAppsReturn {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appsApi.getAllAgents();
      setApps(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return {
    apps,
    loading,
    error,
    refetch: fetchApps,
  };
}