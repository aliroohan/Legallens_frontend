import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { casesApi } from '../../api/cases.api';
import type { UpdateCasePayload } from '../../types';

export const useUpdateCase = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCasePayload) => casesApi.updateCase(caseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success('Case updated.');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Failed to update case.';
      toast.error(message);
    },
  });
};
