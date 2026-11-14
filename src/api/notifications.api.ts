import apiClient from './client';
import type { ApiResponse, AppNotification } from '../types';

export const notificationsApi = {
  list: async (): Promise<AppNotification[]> => {
    const res = await apiClient.get<ApiResponse<AppNotification[]>>('/notifications');
    return res.data.data ?? [];
  },

  markRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post('/notifications/read-all');
  },
};
