'use client';

import React, { useState, useMemo } from 'react';
import { useApps } from '@/hooks/use-apps';
import { AppsGrid } from '@/components/apps/AppsGrid';
import { LoadingSkeleton } from '@/components/apps/LoadingSkeleton';
import { ErrorState } from '@/components/apps/ErrorState';
import { Button } from '@/components/ui/button';
import { App } from '@/lib/types/apps';

export default function AppsPage() {
  const { apps, loading, error, refetch } = useApps();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    if (apps.length === 0) return [];
    const appTypes = apps.map(app => app.app_type);
    return ['All', ...Array.from(new Set(appTypes))];
  }, [apps]);

  const filteredApps = useMemo(() => {
    if (selectedCategory === 'All') {
      return apps;
    }
    return apps.filter(app => app.app_type === selectedCategory);
  }, [apps, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Hub</h1>
        <p className="text-gray-600 mb-4">
          Choose an AI assistant to get started with your AI-powered workflow.
        </p>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading && <LoadingSkeleton />}
        
        {error && (
          <ErrorState 
            error={error} 
            onRetry={refetch}
            loading={loading}
          />
        )}
        
        {!loading && !error && <AppsGrid apps={filteredApps} />}
      </div>
    </div>
  );
}
