import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import type { LoginPayload } from '../../types';

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      const user = data.data?.user;
      const token = data.data?.token;

      // Store token in localStorage and cookies
      if (token) {
        localStorage.setItem('auth_token', token);
        document.cookie = `auth_token=${token}; path=/; max-age=${8 * 3600}; SameSite=Lax`;
      }

      if (user) {
        setUser(user);
        queryClient.setQueryData(['auth', 'me'], data);
        toast.success(`Welcome back, ${user.name?.split(' ')[0] || 'Counsel'}!`);

        // Route based on bar ID status
        if (user.barIdStatus === 'pending') {
          navigate('/auth/verification-pending');
        } else if (user.barIdStatus === 'rejected') {
          navigate('/auth/verification-failed');
        } else {
          navigate('/dashboard');
        }
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Invalid email or password.';
      toast.error(message);
    },
  });
};
