// app/dashboard/agents/new/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AgentForm } from '@/components/agents/agent-form';
import { CreateAgentRequest } from '@/lib/types/agents';
import { ApiKey } from '@/lib/types/api-keys-2';
import { agentsApi } from '@/lib/api/agents';
import { apiKeysApi } from '@/lib/api/api-keys-2';
import { AgentFormData } from '@/lib/validations/agents';

export default function NewAgentPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        setLoading(true);
        setError(null);
        const keysData = await apiKeysApi.getApiKeys();
        setApiKeys(keysData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API keys');
      } finally {
        setLoading(false);
      }
    };

    loadApiKeys();
  }, []);

  const handleSubmit = async (data: AgentFormData) => {
    try {
      setSaving(true);
      setError(null);

      const createData: CreateAgentRequest = {
        ...data,
        mcp_servers: data.mcp_servers?.map(id => ({ mcp_server_id: id })) || [],
      };
      
      const newAgent = await agentsApi.create(createData);
      router.push(`/dashboard/settings/agents/${newAgent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/settings/agents');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
          <p className="text-muted-foreground">
            Configure your new AI agent with custom instructions and tools
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentForm
            apiKeys={apiKeys}
            onSubmit={handleSubmit}
            isSubmitting={saving}
          />
        </CardContent>
      </Card>
    </div>
  );
}