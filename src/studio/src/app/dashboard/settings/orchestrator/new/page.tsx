// src/app/dashboard/orchestrator/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrchestrators } from '@/hooks/use-orchestrators';
import { toast } from 'sonner';
import { OrchestratorForm } from '@/components/orchestrator/orchestrator-form';
import type { CreateOrchestratorFormData } from '@/lib/validations/orchestrator';

export default function NewOrchestratorPage() {
  const router = useRouter();
  const { createOrchestrator } = useOrchestrators();
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<CreateOrchestratorFormData | null>(null);

  const handleFormChange = (data: CreateOrchestratorFormData) => {
    setCurrentFormData(data);
  };

  const handleCreateOrchestrator = async () => {
    if (!currentFormData) {
      toast.error('Form data is not available.');
      return;
    }

    try {
      setIsLoading(true);
      const orchestrator = await createOrchestrator(currentFormData);
      toast.success('Orchestrator created successfully');
      router.push(`/dashboard/settings/orchestrator/${orchestrator.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create orchestrator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/settings/orchestrator');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Orchestrator</h1>
          <p className="text-muted-foreground mt-1">
            Create a new orchestrator to coordinate AI agents
          </p>
        </div>
      </div>

      <OrchestratorForm
        onSubmit={handleFormChange}
        isLoading={isLoading}
        onDirtyChange={setIsDirty}
      />

      {isDirty && (
        <div className="fixed bottom-4 right-4 p-4 bg-muted/50 rounded-lg shadow-lg flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            You have unsaved changes
          </p>
          <Button onClick={handleCreateOrchestrator} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Create Orchestrator'
            )}
          </Button>
        </div>
      )}

      {isDirty && (
        <div className="fixed bottom-4 right-4 p-4 bg-muted/50 rounded-lg shadow-lg flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            You have unsaved changes
          </p>
          <Button onClick={handleCreateOrchestrator} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Create Orchestrator'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}