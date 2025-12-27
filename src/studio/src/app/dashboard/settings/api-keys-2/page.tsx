'use client';

import { ApiKeysTable } from '@/components/api-keys-2/data-table';
import { ApiKeyFormDialog } from '@/components/api-keys-2/form-dialog';
import { Button } from '@/components/ui/button';
import { useApiKeys } from '@/hooks/use-api-keys-2';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function LlmPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { fetchApiKeys } = useApiKeys();

  const handleSuccess = () => {
    fetchApiKeys();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">LLM Providers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your LLM providers, api keys, and model configurations.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New API Key
        </Button>
      </div>

      <ApiKeysTable onSuccess={handleSuccess} />

      <ApiKeyFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}