// src/components/orchestrator/AgentsTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Search, Bot } from 'lucide-react';
import { OrchestratorAgent } from '@/lib/types/orchestrator';
import { useAgents } from '@/hooks/use-agents';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Orchestrator } from '@/lib/types/orchestrator';

interface AgentsTabProps {
  orchestrator: Orchestrator;
  onUpdate: (updatedFields: Partial<Orchestrator>) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

export function AgentsTab({ orchestrator, onUpdate, onDirtyChange }: AgentsTabProps) {
  const { agents: allAgents, loading: isLoadingAgents } = useAgents();
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setSelectedAgents(orchestrator.agents.map(a => a.agent_id));
  }, [orchestrator]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleAgentToggle = (agentId: string) => {
    const newSelectedAgents = selectedAgents.includes(agentId)
      ? selectedAgents.filter(id => id !== agentId)
      : [...selectedAgents, agentId];
    
    setSelectedAgents(newSelectedAgents);
    onUpdate({ agents: newSelectedAgents.map(id => ({ agent_id: id })) });
    setIsDirty(true);
  };

  const filteredAgents = allAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentAgents = allAgents.filter(agent => selectedAgents.includes(agent.id));
  const availableAgents = filteredAgents.filter(agent => !selectedAgents.includes(agent.id));

  if (isLoadingAgents) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agents Configuration</h2>
          <p className="text-muted-foreground">
            Manage the agents that this orchestrator can handoff to
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Current Agents ({currentAgents.length})
            </CardTitle>
            <CardDescription>
              Agents currently assigned to this orchestrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentAgents.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No agents assigned</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentAgents.map((agent) => (
                  <div key={agent.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{agent.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {agent.api_key?.provider_name || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {agent.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role: {agent.role}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Agent</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{agent.name}" from this orchestrator?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAgentToggle(agent.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Available Agents
            </CardTitle>
            <CardDescription>
              Add agents to this orchestrator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {availableAgents.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No agents match your search' : 'All agents are already assigned'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableAgents.map((agent) => (
                    <div key={agent.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`available-${agent.id}`}
                        checked={false}
                        onCheckedChange={() => handleAgentToggle(agent.id)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`available-${agent.id}`}
                          className="cursor-pointer block"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{agent.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {agent.api_key?.provider_name || 'Unknown'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {agent.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Role: {agent.role}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}