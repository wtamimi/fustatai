export interface McpServerConfig {
  command: string;
  args: string[];
}

export interface McpServer {
  id: string;
  name: string;
  description?: string | null;
  transport: 'stdio' | 'streamable-http';
  mode: 'autonomous' | 'supervised';
  config_json: McpServerConfig;
}

export interface McpServerFormValues {
  name: string;
  description?: string | null;
  transport: 'stdio' | 'streamable-http';
  mode: 'autonomous' | 'supervised';
  config_json: string; // Will be stringified JSON
}

export interface McpServerTool {
  tool_name: string;
  tool_description: string;
}