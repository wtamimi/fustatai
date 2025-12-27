// src/lib/types/app.ts

export enum AppType {
  ORCHESTRATOR = 'orchestrator',
  AGENT = "agent"
}

export interface App {
  id: string;
  name: string;
  description: string;
  icon?: string;
  app_type: AppType;
}