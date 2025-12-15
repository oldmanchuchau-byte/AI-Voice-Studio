
export interface Voice {
  id: string;
  apiId: string;
  name: string;
  description: string;
}

export type ApiKeyStatus = 'active' | 'quota_exceeded' | 'error';

export interface ApiKeyData {
  key: string;
  status: ApiKeyStatus;
  errorMessage?: string;
  usageCount: number;
  addedAt: number;
}
