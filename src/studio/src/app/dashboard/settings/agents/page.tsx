// app/dashboard/agents/page.tsx
"use client";

import { useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AgentsTable } from '@/components/agents/agents-table';
import { useAgents } from '@/hooks/use-agents';
import { AgentAiGenerateDialog } from '@/components/agents/agent-ai-generate-dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewAgentDialogOpen, setIsNewAgentDialogOpen] = useState(false);
  const router = useRouter();
  const { agents, loading, error, refetch, deleteAgent } = useAgents();

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewAgent = () => {
    // setIsNewAgentDialogOpen(true);
    router.push('/dashboard/settings/agents/new');
  };

  const handleDeleteAgent = async (id: string) => {
    await deleteAgent(id);
  };

  return (
    <>
      <AgentAiGenerateDialog
        open={isNewAgentDialogOpen}
        onOpenChange={setIsNewAgentDialogOpen}
      />

    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI agents and their configurations.
          </p>
        </div>
        <Button onClick={handleNewAgent} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      {/* <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
            <p className="text-muted-foreground">
              Manage your AI agents and their configurations
            </p>
          </div>
          <Button onClick={handleNewAgent}>
            <Plus className="mr-2 h-4 w-4" />
            New Agent
          </Button>
        </div> */}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
        <LoadingSpinner />
        ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AgentsTable agents={filteredAgents} onDelete={handleDeleteAgent} />
          </CardContent>
        </Card>
      )}
      </div>
    </>
  );
}