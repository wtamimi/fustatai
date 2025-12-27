// src/components/apps/AppsGrid.tsx
import React from 'react';
import { App } from '@/lib/types/apps';
import { AppCard } from './AppCard';

interface AppsGridProps {
  apps: App[];
}

export function AppsGrid({ apps }: AppsGridProps) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No applications available</div>
        <div className="text-gray-400 text-sm mt-2">
          Check back later or contact your administrator
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} />
      ))}
    </div>
  );
}