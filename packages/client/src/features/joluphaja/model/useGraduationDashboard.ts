import { useUserInfo, useGraduationCheck } from '@/entities/joluphaja/model/useGraduation';

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
  };
}
