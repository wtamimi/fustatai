import { ApiKey } from './api-keys-2';
import { McpServer } from './mcp-servers';

export interface AgentMcpServer {
  mcp_server_id: string;
  mcp_server: McpServer;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  task: string;
  instructions: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id: string;
  mcp_servers: AgentMcpServer[];
  api_key: ApiKey;
}

export interface CreateAgentRequest {
  name: string;
  description: string;
  role: string;
  task: string;
  instructions: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id: string;
  mcp_servers: { mcp_server_id: string }[];
}

export interface UpdateAgentRequest {
  name: string;
  description: string;
  role: string;
  task: string;
  instructions: string;
  publish_as_app: boolean;
  app_type: string;
  api_key_id: string;
  mcp_servers: { mcp_server_id: string }[];
}