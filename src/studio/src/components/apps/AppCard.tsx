// src/components/apps/AppCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, LucideIcon } from 'lucide-react';
import { App, AppType } from '@/lib/types/apps';
import * as LucideIcons from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const router = useRouter();

  const handleClick = () => {
    const conversationId = uuidv4();
    if (app.app_type === AppType.ORCHESTRATOR)
      router.push(`/dashboard/a/${app.id}/c/${conversationId}`);
    else
      router.push(`/dashboard/p/${app.id}/c/${conversationId}`);
  };

  // Get the icon component from lucide-react or fallback to Bot
  const getIconComponent = (iconName?: string): LucideIcon => {
    if (!iconName) return Bot;
    
    // Try to find the icon in lucide-react exports
    const IconComponent = (LucideIcons as any)[iconName] as LucideIcon;
    return IconComponent || Bot;
  };

  const IconComponent = getIconComponent(app.icon);

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-200 bg-white"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {app.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-gray-600 leading-relaxed">
          {app.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}