import apiClient from './client';
import type {
  Case,
  CreateCasePayload,
  UpdateCasePayload,
  CaseFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';

export const casesApi = {
  /**
   * List cases with optional filters and pagination
   */
  listCases: async (filters: CaseFilters = {}): Promise<ApiResponse<PaginatedResponse<Case>>> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.matterType) params.set('matterType', filters.matterType);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.sort) params.set('sort', filters.sort);

    const res = await apiClient.get(`/cases?${params.toString()}`);
    return res.data;
  },

  /**
   * Get a single case by ID
   */
  getCaseById: async (caseId: string): Promise<ApiResponse<Case>> => {
    const res = await apiClient.get(`/cases/${caseId}`);
    return res.data;
  },

  /**
   * Create a new case
   */
  createCase: async (payload: CreateCasePayload): Promise<ApiResponse<Case>> => {
    const res = await apiClient.post('/cases', payload);
    return res.data;
  },

  /**
   * Update case metadata or status
   */
  updateCase: async (caseId: string, payload: UpdateCasePayload): Promise<ApiResponse<Case>> => {
    const res = await apiClient.patch(`/cases/${caseId}`, payload);
    return res.data;
  },

  /**
   * Delete a case (must be Closed; requires confirmation string)
   */
  deleteCase: async (caseId: string, confirmationName: string): Promise<ApiResponse> => {
    const res = await apiClient.delete(`/cases/${caseId}`, {
      data: { confirmation: confirmationName },
    });
    return res.data;
  },
};
