// src/components/apps/ErrorState.tsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  loading?: boolean;
}

export function ErrorState({ error, onRetry, loading = false }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Applications</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button 
          onClick={onRetry} 
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Retrying...' : 'Try Again'}
        </Button>
      </div>
    </div>
  );
}