import { useQuery } from '@tanstack/react-query';
import { fetchGraduationCheck, fetchCertificationCriteria, fetchCriteriaCategories } from '../api/graduation';

export const graduationQueryKeys = {
  all: ['graduation'] as const,
  check: () => [...graduationQueryKeys.all, 'check'] as const,
  certificationCriteria: () => [...graduationQueryKeys.all, 'certificationCriteria'] as const,
  criteriaCategories: () => [...graduationQueryKeys.all, 'criteriaCategories'] as const,
};

export function useGraduationCheck() {
  return useQuery({
    queryKey: graduationQueryKeys.check(),
    queryFn: fetchGraduationCheck,
    staleTime: Infinity,
    select: response => response.data,
  });
}

export function useCertificationCriteria(enabled: boolean) {
  return useQuery({
    queryKey: graduationQueryKeys.certificationCriteria(),
    queryFn: fetchCertificationCriteria,
    staleTime: Infinity,
    select: response => response.data,
    enabled,
  });
}

export function useCriteriaCategories() {
  return useQuery({
    queryKey: graduationQueryKeys.criteriaCategories(),
    queryFn: fetchCriteriaCategories,
    staleTime: Infinity,
  });
}

