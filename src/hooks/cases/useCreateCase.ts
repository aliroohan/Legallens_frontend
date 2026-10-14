import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { casesApi } from '../../api/cases.api';
import type { CreateCasePayload } from '../../types';

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateCasePayload) => casesApi.createCase(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case created successfully!');
      const newCase = data.data;
      if (newCase?.id) {
        navigate(`/cases/${newCase.id}`);
      } else {
        navigate('/cases');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Failed to create case.';
      toast.error(message);
    },
  });
};
