import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import type { RegisterIndependentPayload, RegisterOrgAdminPayload } from '../../types';

export const useRegisterIndependent = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterIndependentPayload) => authApi.registerIndependent(payload),
    onSuccess: () => {
      navigate('/auth/verification-pending');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};

export const useRegisterOrgAdmin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterOrgAdminPayload) => authApi.registerOrgAdmin(payload),
    onSuccess: () => {
      navigate('/auth/verification-pending');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(message);
    },
  });
};
