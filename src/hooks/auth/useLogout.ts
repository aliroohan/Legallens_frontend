import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

export const useLogout = () => {
  const { clearUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCleanup = () => {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax';
    clearUser();
    queryClient.clear();
    navigate('/auth/signin');
  };

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      handleCleanup();
      toast.success('Signed out successfully.');
    },
    onError: () => {
      // Even on error, clear local state and token
      handleCleanup();
    },
  });
};
