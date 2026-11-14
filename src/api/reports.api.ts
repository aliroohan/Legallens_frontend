import apiClient from './client';
import type { ApiResponse, CaseReport } from '../types';

export const reportsApi = {
  exportCase: async (caseId: string): Promise<{ reportId: string }> => {
    const res = await apiClient.post<ApiResponse<{ reportId: string }>>(`/cases/${caseId}/export`);
    return res.data.data as { reportId: string };
  },

  list: async (caseId: string): Promise<CaseReport[]> => {
    const res = await apiClient.get<ApiResponse<CaseReport[]>>(`/cases/${caseId}/reports`);
    return res.data.data ?? [];
  },

  download: async (caseId: string, reportId: string): Promise<void> => {
    const res = await apiClient.get(`/cases/${caseId}/reports/${reportId}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `legallens-${reportId}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
