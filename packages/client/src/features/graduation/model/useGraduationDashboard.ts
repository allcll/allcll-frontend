import { useMe } from '@/entities/user/model/useAuth';
import { useGraduationCheck } from '@/entities/graduation/model/useGraduation';

export function useGraduationDashboard() {
  const userQuery = useMe();
  const graduationCheckQuery = useGraduationCheck();

  return {
    user: userQuery.data,
    graduationData: graduationCheckQuery.data,
    isPending: userQuery.isPending || graduationCheckQuery.isPending,
    isLoading: userQuery.isLoading || graduationCheckQuery.isLoading,
    isError: userQuery.isError || graduationCheckQuery.isError,
    error: userQuery.error || graduationCheckQuery.error,
  };
}
