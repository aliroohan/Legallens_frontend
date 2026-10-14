import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

/**
 * useMe — Restores user session on app mount by calling GET /api/auth/me
 * Only runs if an auth_token exists in localStorage.
 * Populates Zustand auth store on success, clears it on failure.
 */
export const useMe = () => {
  const { setUser, clearUser, setLoading } = useAuthStore();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: Boolean(token),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 min
  });

  useEffect(() => {
    // If no token exists, immediately mark loading as false and clear state
    if (!token) {
      clearUser();
      setLoading(false);
      return;
    }

    if (!query.isLoading) {
      if (query.isSuccess && query.data?.data?.user) {
        setUser(query.data.data.user);
      } else if (query.isError) {
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
        clearUser();
      }
      setLoading(false);
    }
  }, [token, query.isLoading, query.isSuccess, query.isError, query.data, setUser, clearUser, setLoading]);

  return query;
};
