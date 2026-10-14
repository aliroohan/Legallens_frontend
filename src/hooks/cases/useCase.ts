import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../../api/cases.api';

export const useCase = (caseId: string) => {
  return useQuery({
    queryKey: ['cases', caseId],
    queryFn: () => casesApi.getCaseById(caseId),
    enabled: Boolean(caseId),
  });
};
