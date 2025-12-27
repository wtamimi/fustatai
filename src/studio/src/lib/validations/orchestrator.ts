// src/lib/validations/orchestrator.ts
import { z } from 'zod';

export const createOrchestratorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  instructions: z.string().min(1, 'Instructions are required'),
  publish_as_app: z.boolean(),
  app_type: z.string().min(1, 'App Type is required').max(50, 'App Type must be less than 50 characters'),
  api_key_id: z.string().min(1, 'API Key is required'),
  agents: z.array(z.object({
    agent_id: z.string().min(1, 'Agent ID is required')
  })).min(0, 'At least one agent must be selected')
});

export const updateOrchestratorSchema = createOrchestratorSchema;

export type CreateOrchestratorFormData = z.infer<typeof createOrchestratorSchema>;
export type UpdateOrchestratorFormData = z.infer<typeof updateOrchestratorSchema>;