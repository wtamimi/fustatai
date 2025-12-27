// components/agents/agent-tools.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { McpServer } from '@/lib/types/mcp-servers';
import { fetchMcpServers } from '@/lib/api/mcp-servers';

interface AgentToolsProps {
  selectedServerIds: string[];
  onSelectionChange: (serverIds: string[]) => void;
}

export function AgentTools({ selectedServerIds, onSelectionChange }: AgentToolsProps) {
  const [availableServers, setAvailableServers] = useState<McpServer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServers = async () => {
      try {
        const servers = await fetchMcpServers();
        setAvailableServers(servers);
      } catch (error) {
        console.error('Failed to load MCP servers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, []);

  const filteredServers = availableServers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedServers = availableServers.filter(server =>
    selectedServerIds.includes(server.id)
  );

  const handleServerToggle = (serverId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedServerIds, serverId]);
    } else {
      onSelectionChange(selectedServerIds.filter(id => id !== serverId));
    }
  };

  const handleRemoveServer = (serverId: string) => {
    onSelectionChange(selectedServerIds.filter(id => id !== serverId));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading tools...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selected Tools</h3>
        {selectedServers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tools selected</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedServers.map(server => (
              <Badge key={server.id} variant="secondary" className="pr-1">
                {server.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0.5"
                  onClick={() => handleRemoveServer(server.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Available Tools</h3>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredServers.map(server => (
                <Card key={server.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={server.id}
                      checked={selectedServerIds.includes(server.id)}
                      onCheckedChange={(checked) => 
                        handleServerToggle(server.id, checked as boolean)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={server.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {server.name}
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {server.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {server.config_json.command}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {server.config_json.args.join(' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}