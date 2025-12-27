import { apiClient } from "./client";
import {
  ApiKey,
  CreateApiKeyRequest,
} from "../types/api-keys-2";

const RESOURCE_PATH = "/api-keys";

export const apiKeysApi = {
  // Get all Api Keys
  getApiKeys: async (): Promise<ApiKey[]> => {
    const response = await apiClient.get<ApiKey[]>(
      RESOURCE_PATH
    );
    return response.data;
  },

  // Create a new api key
  createApiKey: async (
    data: CreateApiKeyRequest
  ): Promise<ApiKey> => {
    const response = await apiClient.post<ApiKey>(
      RESOURCE_PATH,
      data
    );
    return response.data;
  },

  // Update an api key
  updateApiKey: async (
    id: string,
    data: CreateApiKeyRequest
  ): Promise<ApiKey> => {
    const response = await apiClient.put<ApiKey>(
      `${RESOURCE_PATH}/${id}`,
      data
    );
    return response.data;
  },

  // Delete an api key
  deleteApiKey: async (id: string): Promise<void> => {
    await apiClient.delete(`${RESOURCE_PATH}/${id}`);
  },

  // Get a single api key
  getApiKey: async (id: string): Promise<ApiKey> => {
    const response = await apiClient.get<ApiKey>(
      `${RESOURCE_PATH}/${id}`
    );
    return response.data;
  },
};
