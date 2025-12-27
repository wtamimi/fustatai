// lib/validations/agent.ts
import { z } from 'zod';

export const agentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  role: z.string().min(1, 'Role is required').max(500, 'Role must be less than 200 characters'),
  task: z.string().min(1, 'Task is required').max(2000, 'Task must be less than 2000 characters'),
  instructions: z.string().min(1, 'Instructions are required').max(8000, 'Instructions must be less than 8000 characters'),
  publish_as_app: z.boolean(),
  app_type: z.string().min(1, 'App Type is required').max(50, 'App Type must be less than 50 characters'),
  api_key_id: z.string().min(1, 'API Key is required'),
  mcp_servers: z.array(z.string()).optional(),
});

export type AgentFormData = z.infer<typeof agentSchema>;