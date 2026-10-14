import apiClient from './client';
import type {
  User,
  LoginPayload,
  RegisterIndependentPayload,
  RegisterOrgAdminPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
} from '../types';

export const authApi = {
  /**
   * Sign in with email + password
   * Returns { user, token } in data envelope
   */
  login: async (
    payload: LoginPayload
  ): Promise<ApiResponse<{ user: User; token: string }>> => {
    const res = await apiClient.post('/auth/login', payload);
    const rawData = res.data?.data;
    const rawUser = rawData?.user || rawData;
    const token = rawData?.token || '';

    return {
      ...res.data,
      data: {
        user: {
          ...rawUser,
          id: rawUser?.id || rawUser?.userId || '',
        },
        token,
      },
    };
  },

  /**
   * Register independent lawyer
   */
  registerIndependent: async (
    payload: RegisterIndependentPayload
  ): Promise<ApiResponse<{ user: User }>> => {
    const res = await apiClient.post('/auth/register-independent', payload);
    return res.data;
  },

  /**
   * Register organization admin
   */
  registerOrgAdmin: async (
    payload: RegisterOrgAdminPayload
  ): Promise<ApiResponse<{ user: User }>> => {
    const res = await apiClient.post('/auth/register', payload);
    return res.data;
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const res = await apiClient.get('/auth/me');
    const rawData = res.data?.data;
    const user = rawData?.user || rawData;

    return {
      ...res.data,
      data: {
        user: {
          ...user,
          id: user?.id || user?.userId || '',
        },
      },
    };
  },

  /**
   * Logout — invalidates session token on backend
   */
  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ApiResponse> => {
    const res = await apiClient.post('/auth/forgot-password', payload);
    return res.data;
  },

  /**
   * Reset password using token from email link
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ApiResponse> => {
    const res = await apiClient.post('/auth/reset-password', payload);
    return res.data;
  },
};
