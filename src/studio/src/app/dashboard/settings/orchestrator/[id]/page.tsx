// src/app/dashboard/orchestrator/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrchestrator, useOrchestrators } from '@/hooks/use-orchestrators';
import { toast  } from 'sonner';
import { OrchestratorForm } from '@/components/orchestrator/orchestrator-form';
import { AgentsTab } from '@/components/orchestrator/agents-tab';
import { TestTab } from '@/components/orchestrator/test-tab';
import type { CreateOrchestratorFormData } from '@/lib/validations/orchestrator';
import type { Orchestrator } from '@/lib/types/orchestrator';
import { Plus, Edit, Trash2, Users, Bot, RefreshCw, ExternalLink } from 'lucide-react';

export default function OrchestratorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { updateOrchestrator: updateOrchestratorMutation, createOrchestrator: createOrchestratorMutation } = useOrchestrators();
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentOrchestrator, setCurrentOrchestrator] = useState<Orchestrator | null>(null);

  const isNew = params.id === 'new';
  const orchestratorId = params.id as string;
  const { orchestrator, loading, error, refetch } = useOrchestrator(orchestratorId);

  useEffect(() => {
    if (orchestrator) {
      setCurrentOrchestrator(orchestrator);
    } else if (isNew) {
      setCurrentOrchestrator({
        id: '', // Temporary ID for new orchestrator
        name: '',
        description: '',
        instructions: '',
        publish_as_app: true,
        app_type: 'Productivity',
        api_key_id: '',
        agents: [],
        api_key: undefined
      });
    }
  }, [orchestrator, isNew]);

  const handleOrchestratorUpdate = (updatedFields: Partial<Orchestrator>) => {
    setCurrentOrchestrator(prev => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
    setIsDirty(true);
  };

  const handleSubmit = async () => {
    if (!currentOrchestrator) return;

    try {
      setIsLoading(true);
      let resultOrchestrator: Orchestrator;

      const payload = {
        name: currentOrchestrator.name,
        description: currentOrchestrator.description,
        instructions: currentOrchestrator.instructions,
        publish_as_app: currentOrchestrator.publish_as_app,
        app_type: currentOrchestrator.app_type,
        api_key_id: currentOrchestrator.api_key_id,
        agents: currentOrchestrator.agents.map(a => ({ agent_id: a.agent_id })),
      };

      if (isNew) {
        resultOrchestrator = await createOrchestratorMutation(payload);
        toast.success('Orchestrator created successfully');
        router.push(`/dashboard/settings/orchestrator/${resultOrchestrator.id}`);
      } else {
        resultOrchestrator = await updateOrchestratorMutation(orchestratorId, payload);
        toast.success('Orchestrator updated successfully');
        refetch(); // Re-fetch to ensure latest data is in sync
      }
      setIsDirty(false);
      setCurrentOrchestrator(resultOrchestrator);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/settings/orchestrator');
  };

  if (loading && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orchestrators
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentOrchestrator && !isNew) {
    return null; // Or a loading spinner if preferred, but should be caught by initial loading state
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? 'Create Orchestrator' : `Edit ${currentOrchestrator?.name}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew 
              ? 'Create a new orchestrator to coordinate AI agents' 
              : 'Manage your orchestrator settings and agents'
            }
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
          <TabsTrigger value="agents" disabled={isNew}>
            Agents
          </TabsTrigger>
          <TabsTrigger value="test" disabled={isNew}>
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orchestrator" className="space-y-6">
          {currentOrchestrator && (
            <OrchestratorForm
              initialData={currentOrchestrator}
              onSubmit={(data) => handleOrchestratorUpdate(data)}
              isLoading={isLoading}
              onDirtyChange={setIsDirty}
            />
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          {currentOrchestrator && (
            <AgentsTab
              orchestrator={currentOrchestrator}
              onUpdate={handleOrchestratorUpdate}
              onDirtyChange={setIsDirty}
            />
          )}
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          {currentOrchestrator && (
                        <Card>
              <CardHeader>
                <CardTitle>Test Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Agent Hub to test your agentic workflow</h3>
                <Button onClick={() => window.open(`http://localhost:3000/c/${currentOrchestrator.id}`, '_blank')} className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Go to Agent Hub
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {!isNew && isDirty && (
        <div className="fixed bottom-4 right-4 p-4 bg-muted/50 rounded-lg shadow-lg flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            You have unsaved changes
          </p>
          <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </div>
  );
}