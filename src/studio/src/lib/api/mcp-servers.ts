import { apiClient } from './client';
import { McpServer, McpServerFormValues, McpServerTool} from '@/lib/types/mcp-servers';

export const fetchMcpServers = async (): Promise<McpServer[]> => {
  const response = await apiClient.get('/mcp-servers');
  return response.data;
};

export const createMcpServer = async (data: McpServerFormValues): Promise<McpServer> => {
  // Parse JSON string to object
  const payload = {
    ...data,
    config_json: JSON.parse(data.config_json)
  };
  const response = await apiClient.post('/mcp-servers', payload);
  return response.data;
};

export const updateMcpServer = async (id: string, data: McpServerFormValues): Promise<McpServer> => {
  // Parse JSON string to object
  const payload = {
    ...data,
    config_json: JSON.parse(data.config_json)
  };
  const response = await apiClient.put(`/mcp-servers/${id}`, payload);
  return response.data;
};

export const deleteMcpServer = async (id: string): Promise<void> => {
  await apiClient.delete(`/mcp-servers/${id}`);
};

export const fetchToolsByServerId = async (serverId: string): Promise<McpServerTool[]> => {
  const response = await apiClient.get(`/mcp-servers/${serverId}/tools`);
  return response.data;
};