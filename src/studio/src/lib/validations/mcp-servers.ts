import { z } from 'zod';

// Define base schema for config JSON
const configSchema = z.object({
  command: z.string().min(1, "Command is required"),
  args: z.array(z.string()).min(1, "At least one argument is required"),
}).passthrough(); // Allow additional properties

export const mcpServerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  transport: z.string().min(1, 'Transport Layer is required'),
  mode: z.string().min(1, 'Mode is required'),
  config_json: z.string().refine(
    value => {
      try {
        const parsed = JSON.parse(value);
        return configSchema.safeParse(parsed).success;
      } catch {
        return false;
      }
    },
    {
      message: 'Must be valid JSON with "command" (string) and "args" (array of strings). Additional properties are allowed.',
    }
  )
});

export type McpServerFormValues = z.infer<typeof mcpServerSchema>;