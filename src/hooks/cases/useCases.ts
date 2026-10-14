import { useQuery } from '@tanstack/react-query';
import { casesApi } from '../../api/cases.api';
import type { CaseFilters } from '../../types';

export const useCases = (filters: CaseFilters = {}) => {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => casesApi.listCases(filters),
  });
};
