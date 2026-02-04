import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo, fetchGraduationCheck } from '../api/graduation';

export const graduationQueryKeys = {
  all: ['graduation'] as const,
  userInfo: () => [...graduationQueryKeys.all, 'userInfo'] as const,
  check: () => [...graduationQueryKeys.all, 'check'] as const,
};

export function useUserInfo() {
  return useQuery({
    queryKey: graduationQueryKeys.userInfo(),
    queryFn: fetchUserInfo,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGraduationCheck() {
  return useQuery({
    queryKey: graduationQueryKeys.check(),
    queryFn: fetchGraduationCheck,
    staleTime: 1000 * 60 * 5,
    select: response => response.data,
  });
}

export function useGraduationDashboard() {
  const userInfoQuery = useUserInfo();
  const graduationCheckQuery = useGraduationCheck();

  return {
    userInfo: userInfoQuery.data,
    graduationData: graduationCheckQuery.data,
    isPending: userInfoQuery.isPending || graduationCheckQuery.isPending,
    isLoading: userInfoQuery.isLoading || graduationCheckQuery.isLoading,
    isError: userInfoQuery.isError || graduationCheckQuery.isError,
    error: userInfoQuery.error || graduationCheckQuery.error,
    refetch: () => {
      graduationCheckQuery.refetch();
    },
  };
}
