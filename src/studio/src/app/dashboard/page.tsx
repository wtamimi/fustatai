// app/dashboard/page.tsx
// src/app/apps/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useApps } from '@/hooks/use-apps';
import { AppsGrid } from '@/components/apps/AppsGrid';
import { LoadingSkeleton } from '@/components/apps/LoadingSkeleton';
import { ErrorState } from '@/components/apps/ErrorState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Users, Bot, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppsPage() {
  const router = useRouter();
  const { apps, loading, error, refetch } = useApps();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Studio</h1>
        <p className="text-gray-600">
          Build and deploy agents to accelerate AI use case delivery.
        </p>
      </div>

      {/* Content */}
      <div className="min-h-[100px]">
        {/* TODO: temp content for now - add dashboard */}

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Welcome to FustatAI</h3>
            <p className="text-muted-foreground text-center mb-6">
              Quick Start Guide:
            </p>
            <p className="text-foreground text-center">
              1. Add your LLM API Key 
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" 
                onClick={() => router.push('/dashboard/settings/api-keys-2')}>
                  <ExternalLink className="h-3 w-3" />
              </Button>
            </p>
            <p className="text-foreground text-center">
              2. Add MCP Servers 
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" 
                onClick={() => router.push('/dashboard/settings/mcp-servers')}>
                  <ExternalLink className="h-3 w-3" />
              </Button>
            </p>
            <p className="text-foreground text-center">
              3. Create agents and Publish as App to make them available in Agent Hub 
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" 
                onClick={() => router.push('/dashboard/settings/agents')}>
                  <ExternalLink className="h-3 w-3" />
              </Button>
            </p>
            <p className="text-foreground text-center">
              4. Create AI Agentic Workflows  
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0" 
                onClick={() => router.push('/dashboard/settings/orchestrator')}>
                  <ExternalLink className="h-3 w-3" />
              </Button>
            </p>
          </CardContent>
        </Card>

        {/* <LoadingSkeleton />
        {loading && <LoadingSkeleton />}
        
        {error && (
          <ErrorState 
            error={error} 
            onRetry={refetch}
            loading={loading}
          />
        )}
        
        {!loading && !error && <AppsGrid apps={apps} />} */}
      </div>
    </div>
  );
}
