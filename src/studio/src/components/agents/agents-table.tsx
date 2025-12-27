// components/agents/agents-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Agent } from '@/lib/types/agents';
import { AgentActions } from './agent-actions';

interface AgentsTableProps {
  agents: Agent[];
  onDelete: (id: string) => Promise<void>;
}

export function AgentsTable({ agents, onDelete }: AgentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            {/*<TableHead>Role</TableHead>*/}
            <TableHead>API Key</TableHead>
            <TableHead>MCP Servers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No agents found
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell className="max-w-xs truncate">{agent.description}</TableCell>
                {/*<TableCell className="max-w-xs truncate">{agent.role}</TableCell>*/}
                <TableCell>
                  <Badge variant="secondary">
                    {agent.api_key.name} ({agent.api_key.provider_name})
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {agent.mcp_servers.length === 0 ? (
                      <span className="text-muted-foreground text-sm">None</span>
                    ) : (
                      agent.mcp_servers.map((server) => (
                        <Badge key={server.mcp_server_id} variant="outline" className="text-xs">
                          {server.mcp_server.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <AgentActions agent={agent} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}