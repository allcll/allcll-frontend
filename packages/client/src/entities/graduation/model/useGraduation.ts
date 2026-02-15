import { useQuery } from '@tanstack/react-query';
import {
  fetchGraduationCheck,
  fetchCertificationCriteria,
  fetchAdmissionYearDepartments,
  fetchCriteriaCategories,
} from '../api/graduation';

export const graduationQueryKeys = {
  all: ['graduation'] as const,
  check: () => [...graduationQueryKeys.all, 'check'] as const,
  certificationCriteria: () => [...graduationQueryKeys.all, 'certificationCriteria'] as const,
  departments: () => [...graduationQueryKeys.all, 'departments'] as const,
  criteriaCategories: () => [...graduationQueryKeys.all, 'criteriaCategories'] as const,
};

export function useGraduationCheck(enabled = true) {
  return useQuery({
    queryKey: graduationQueryKeys.check(),
    queryFn: fetchGraduationCheck,
    staleTime: Infinity,
    enabled,
  });
}

export function useCertificationCriteria(enabled: boolean) {
  return useQuery({
    queryKey: graduationQueryKeys.certificationCriteria(),
    queryFn: fetchCertificationCriteria,
    staleTime: Infinity,
    enabled,
  });
}

export function useAdmissionYearDepartments() {
  return useQuery({
    queryKey: graduationQueryKeys.departments(),
    queryFn: fetchAdmissionYearDepartments,
    staleTime: Infinity,
    select: response =>
      response.departments.map(dept => ({
        departmentCode: dept.deptCd,
        departmentName: dept.deptNm,
      })),
  });
}

export function useCriteriaCategories() {
  return useQuery({
    queryKey: graduationQueryKeys.criteriaCategories(),
    queryFn: fetchCriteriaCategories,
    staleTime: Infinity,
  });
}
