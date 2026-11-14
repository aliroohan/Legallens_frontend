import apiClient from './client';
import type { ApiResponse, Organization, User } from '../types';

const asUser = (user: User & { userId?: string }): User => ({
  ...user,
  id: user.id || user.userId || '',
});

export const adminApi = {
  listOrganizations: async (): Promise<Organization[]> => {
    const res = await apiClient.get<ApiResponse<Organization[]>>('/super-admin/organizations');
    return res.data.data ?? [];
  },

  createOrganization: async (payload: {
    name: string;
    adminEmail: string;
    adminName: string;
    adminPassword: string;
    maxUsers?: number;
    monthlyForensicLimit?: number;
  }): Promise<{ organization: Organization; adminCredentials?: { email: string; tempPassword?: string } }> => {
    const res = await apiClient.post('/super-admin/organizations', payload);
    return res.data.data;
  },

  updateOrganization: async (orgId: string, payload: Partial<Organization> & { status?: Organization['status'] }): Promise<Organization> => {
    const res = await apiClient.patch<ApiResponse<Organization>>(`/super-admin/organizations/${orgId}`, payload);
    return res.data.data as Organization;
  },

  storageOverview: async (): Promise<unknown> => {
    const res = await apiClient.get('/super-admin/storage-overview');
    return res.data.data;
  },

  listUsers: async (params?: { barIdStatus?: string; isIndependent?: boolean }): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/super-admin/users', { params });
    return (res.data.data ?? []).map(asUser);
  },

  updateQuotas: async (userId: string, payload: { allocatedStorageBytes?: number; monthlyForensicLimit?: number }): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>(`/super-admin/users/${userId}/quotas`, payload);
    return asUser(res.data.data as User);
  },

  verifyBarId: async (userId: string, status: 'verified' | 'rejected'): Promise<User> => {
    const res = await apiClient.post<ApiResponse<User>>(`/auth/users/${userId}/verify-bar-id`, { status });
    return asUser(res.data.data as User);
  },

  myOrg: async (): Promise<Organization> => {
    const res = await apiClient.get<ApiResponse<Organization>>('/organizations/my-org');
    return res.data.data as Organization;
  },

  listLawyers: async (): Promise<User[]> => {
    const res = await apiClient.get<ApiResponse<User[]>>('/organizations/lawyers');
    return (res.data.data ?? []).map(asUser);
  },

  addLawyer: async (payload: { name: string; email: string; barId: string; password?: string }) => {
    const res = await apiClient.post('/organizations/lawyers', payload);
    const data = res.data.data as { lawyer: User; tempPassword?: string };
    return { lawyer: asUser(data.lawyer), tempPassword: data.tempPassword };
  },

  updateLawyer: async (userId: string, payload: { name?: string; barId?: string }): Promise<User> => {
    const res = await apiClient.patch<ApiResponse<User>>(`/organizations/lawyers/${userId}`, payload);
    return asUser(res.data.data as User);
  },

  removeLawyer: async (userId: string): Promise<void> => {
    await apiClient.delete(`/organizations/lawyers/${userId}`);
  },

  resetLawyerPassword: async (userId: string): Promise<{ message: string; tempPassword?: string }> => {
    const res = await apiClient.post(`/auth/users/${userId}/reset-password`, {});
    return res.data.data;
  },
};
