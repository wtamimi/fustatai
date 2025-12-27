import { z } from 'zod';

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  provider_name: z.string().min(1, 'Provider name is required'),
  model_name: z.string().min(1, 'Model name is required'),
  base_url: z.string().url('Please enter a valid URL'),
  secret_key: z.string().min(1, 'Secret key is required'),
});

export const updateApiKeySchema = apiKeySchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type UpdateApiKeyFormData = z.infer<typeof updateApiKeySchema>;