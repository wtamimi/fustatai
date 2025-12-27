export interface ApiKey {
  id: string;
  name: string;
  provider_name: string;
  model_name: string;
  base_url: string;
  secret_key: string;
}

export interface CreateApiKeyRequest {
  name: string;
  provider_name: string;
  model_name: string;
  base_url: string;
  secret_key: string;
}

export interface UpdateApiKeyRequest extends ApiKey {
  id: string;
}