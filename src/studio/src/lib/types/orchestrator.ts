import { Agent } from './agents';
import { ApiKey } from './api-keys-2';

export interface OrchestratorAgent {
  agent_id: string;
  agent: Agent;
}

export interface Orchestrator {
  id: string;
  name: string;
  description: string;
  instructions: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id: string;
  agents: OrchestratorAgent[];
  api_key: ApiKey;
}

export interface CreateOrchestratorRequest {
  name: string;
  description: string;
  instructions: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id: string;
  agents: { agent_id: string }[];
}

export interface UpdateOrchestratorRequest {
  name?: string;
  description?: string;
  instructions?: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id?: string;
  agents?: { agent_id: string }[];
}

export interface TraceMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agent?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}