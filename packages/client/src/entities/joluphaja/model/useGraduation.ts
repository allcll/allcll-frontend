import { useQuery } from '@tanstack/react-query';
import {
  fetchGraduationCheck,
  fetchCertificationCriteria,
  fetchAdmissionYearDepartments,
} from '../api/graduation';

export const graduationQueryKeys = {
  all: ['graduation'] as const,
  check: () => [...graduationQueryKeys.all, 'check'] as const,
  certificationCriteria: () => [...graduationQueryKeys.all, 'certificationCriteria'] as const,
  departments: () => [...graduationQueryKeys.all, 'departments'] as const,
};

export function useGraduationCheck() {
  return useQuery({
    queryKey: graduationQueryKeys.check(),
    queryFn: fetchGraduationCheck,
    staleTime: 1000 * 60 * 5,
    select: response => response.data,
  });
}

export function useCertificationCriteria(enabled: boolean) {
  return useQuery({
    queryKey: graduationQueryKeys.certificationCriteria(),
    queryFn: fetchCertificationCriteria,
    staleTime: 1000 * 60 * 10,
    select: response => response.data,
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
