// app/dashboard/agents/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Settings, Wrench, TestTube, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AgentForm } from '@/components/agents/agent-form';
import { AgentTools } from '@/components/agents/agent-tools';
import { AgentTest } from '@/components/agents/agent-test';
import { Agent, CreateAgentRequest, UpdateAgentRequest } from '@/lib/types/agents';
import { ApiKey } from '@/lib/types/api-keys-2';
import { agentsApi } from '@/lib/api/agents';
import { apiKeysApi } from '@/lib/api/api-keys-2';
import { AgentFormData } from '@/lib/validations/agents';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, Bot, RefreshCw } from 'lucide-react';

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | undefined >( undefined );
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMcpServerIds, setSelectedMcpServerIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('agent');

  const isNew = params.id === 'new';
  const agentId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load API keys
        const keysData = await apiKeysApi.getApiKeys();
        setApiKeys(keysData);

        // Load agent if editing
        if (!isNew) {
          const agentData = await agentsApi.getById(agentId);
          setAgent(agentData);
          setSelectedMcpServerIds(agentData.mcp_servers.map(s => s.mcp_server_id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error(
        err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isNew, agentId]);

  const handleSubmit = async (data: AgentFormData) => {
    try {
      setSaving(true);
      setError(null);

      if (isNew) {
        const createData: CreateAgentRequest = {
          ...data,
          mcp_servers: selectedMcpServerIds.map(id => ({ mcp_server_id: id })),
        };
        const newAgent = await agentsApi.create(createData);
        setAgent(newAgent);
        toast.success('Agent created successfully');
        router.push(`/dashboard/settings/agents/${newAgent.id}`);
      } else {
        const updateData: UpdateAgentRequest = {
          ...data,
          mcp_servers: selectedMcpServerIds.map(id => ({ mcp_server_id: id })),
        };
        const updatedAgent = await agentsApi.update(agentId, updateData);
        setAgent(updatedAgent);
        toast.success('Agent updated successfully');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save agent');
      toast.error(
        err instanceof Error ? err.message : 'Failed to save agent');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isNew ? 'Create New Agent' : `Edit ${agent?.name}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Configure your new AI agent' : 'Modify agent settings and test functionality'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agent" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Agent
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Tools
          </TabsTrigger>
          <TabsTrigger 
            value="test" 
            className="flex items-center gap-2"
            disabled={isNew}
          >
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentForm
                agent={agent}
                apiKeys={apiKeys}
                onSubmit={handleSubmit}
                isSubmitting={saving}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MCP Server Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentTools
                selectedServerIds={selectedMcpServerIds}
                onSelectionChange={setSelectedMcpServerIds}
              />
              <div className="flex justify-end mt-6">
                <Button onClick={() => handleSubmit({
                  name: agent?.name || '',
                  description: agent?.description || '',
                  role: agent?.role || '',
                  task: agent?.task || '',
                  instructions: agent?.instructions || '',
                  publish_as_app: agent?.publish_as_app || false,
                  app_type: agent?.app_type || 'Productivity',
                  api_key_id: agent?.api_key_id || '',
                  //mcp_server_ids: selectedMcpServerIds,
                })} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Tools'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          {agent && (
            <Card>
              <CardHeader>
                <CardTitle>Test Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Agent Hub to test your agent</h3>
                <Button onClick={() => window.open(`http://localhost:3000/c/${agent.id}`, '_blank')} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Go to Agent Hub
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}