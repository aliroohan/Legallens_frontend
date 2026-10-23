import apiClient from './client';
import type {
  Case,
  CreateCasePayload,
  UpdateCasePayload,
  CaseFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// Backend case document -> the Case shape the frontend pages expect
const fromBackend = (c: any): Case =>
  ({
    ...c,
    id: c.caseId,
    title: c.caseName,
  }) as unknown as Case;

export const casesApi = {
  listCases: async (filters: CaseFilters = {}): Promise<ApiResponse<PaginatedResponse<Case>>> => {
    const res = await apiClient.get('/cases', {
      params: {
        status: filters.status || undefined,
        matterType: filters.matterType || undefined,
        page: filters.page,
        limit: filters.limit,
      },
    });
    const body = res.data;
    return {
      ...body,
      data: {
        items: (body.data ?? []).map(fromBackend),
        total: body.meta?.total ?? 0,
        page: body.meta?.page ?? 1,
        totalPages: body.meta?.totalPages ?? 1,
      },
    } as unknown as ApiResponse<PaginatedResponse<Case>>;
  },

  getCaseById: async (caseId: string): Promise<ApiResponse<Case>> => {
    const res = await apiClient.get(`/cases/${caseId}`);
    return { ...res.data, data: fromBackend(res.data.data) };
  },

  createCase: async (payload: CreateCasePayload): Promise<ApiResponse<Case>> => {
    const p = payload as CreateCasePayload & { opposingParty?: string };
    const res = await apiClient.post('/cases', {
      caseName: p.title,
      clientName: p.clientName,
      matterType: p.matterType,
      description: p.description ?? '',
      opposingParty: p.opposingParty, // ignored by backend until you add that field
    });
    return { ...res.data, data: fromBackend(res.data.data) };
  },

  updateCase: async (caseId: string, payload: UpdateCasePayload): Promise<ApiResponse<Case>> => {
    const { title, ...rest } = payload as UpdateCasePayload & { title?: string };
    const res = await apiClient.patch(`/cases/${caseId}`, {
      ...rest,
      ...(title !== undefined ? { caseName: title } : {}),
    });
    return { ...res.data, data: fromBackend(res.data.data) };
  },

  deleteCase: async (caseId: string, confirmationName: string): Promise<ApiResponse> => {
    const res = await apiClient.delete(`/cases/${caseId}`, {
      data: { confirmCaseName: confirmationName },
    });
    return res.data;
  },
};