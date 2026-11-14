import apiClient from './client';
import type { ApiResponse, EvidenceFile } from '../types';

const fromBackend = (file: EvidenceFile & { fileId?: string; sizeBytes?: number; uploadedAt?: string }): EvidenceFile => ({
  ...file,
  id: file.fileId || file.id,
  size: file.sizeBytes ?? file.size ?? 0,
  createdAt: file.uploadedAt || file.createdAt,
});

export const filesApi = {
  list: async (caseId: string): Promise<EvidenceFile[]> => {
    const res = await apiClient.get<ApiResponse<EvidenceFile[]>>(`/cases/${caseId}/files`);
    return (res.data.data ?? []).map(fromBackend);
  },

  upload: async (caseId: string, files: File[]): Promise<EvidenceFile[]> => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const res = await apiClient.post<ApiResponse<EvidenceFile[]>>(`/cases/${caseId}/files`, form);
    return (res.data.data ?? []).map(fromBackend);
  },

  remove: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
  },

  previewUrl: async (fileId: string): Promise<string> => {
    const res = await apiClient.get(`/files/${fileId}/preview`, { responseType: 'blob' });
    return URL.createObjectURL(res.data);
  },
};
