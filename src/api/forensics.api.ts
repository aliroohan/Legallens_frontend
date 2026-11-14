import apiClient from './client';
import type { ApiResponse, ForensicResult, ReverseSearchResult } from '../types';

export const forensicsApi = {
  listForCase: async (caseId: string): Promise<ForensicResult[]> => {
    const res = await apiClient.get<ApiResponse<ForensicResult[]>>(`/cases/${caseId}/forensics`);
    return res.data.data ?? [];
  },

  analyze: async (fileId: string): Promise<ForensicResult> => {
    const res = await apiClient.post<ApiResponse<ForensicResult>>(`/files/${fileId}/analyze`, {});
    return res.data.data as ForensicResult;
  },

  reverseSearch: async (fileId: string): Promise<ReverseSearchResult> => {
    const res = await apiClient.post<ApiResponse<ReverseSearchResult>>(`/files/${fileId}/reverse-search`);
    return res.data.data as ReverseSearchResult;
  },

  getReverseSearch: async (fileId: string): Promise<ReverseSearchResult> => {
    const res = await apiClient.get<ApiResponse<ReverseSearchResult>>(`/files/${fileId}/reverse-search`);
    return res.data.data as ReverseSearchResult;
  },
};
