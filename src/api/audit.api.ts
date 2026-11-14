import apiClient from './client';
import type { ApiResponse, AuditEntry } from '../types';

export const auditApi = {
  caseHistory: async (caseId: string): Promise<AuditEntry[]> => {
    const res = await apiClient.get<ApiResponse<AuditEntry[]>>(`/cases/${caseId}/history`);
    return res.data.data ?? [];
  },

  platform: async (): Promise<AuditEntry[]> => {
    const res = await apiClient.get<ApiResponse<AuditEntry[]>>('/audit-logs');
    return res.data.data ?? [];
  },
};
