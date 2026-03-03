import { useMe } from '@/entities/user/model/useAuth';
import { useGraduationCheck, useGraduationCourses } from '@/entities/graduation/model/useGraduation';

export function useGraduationDashboard() {
  const userQuery = useMe();
  const graduationCheckQuery = useGraduationCheck();
  const graduationCoursesQuery = useGraduationCourses();

  return {
    user: userQuery.data,
    graduationData: graduationCheckQuery.data,
    analyzedAt: graduationCoursesQuery.data?.createdAt ?? null,
    isPending: userQuery.isPending || graduationCheckQuery.isPending,
    isLoading: userQuery.isLoading || graduationCheckQuery.isLoading,
    isError: userQuery.isError || graduationCheckQuery.isError,
    error: userQuery.error || graduationCheckQuery.error,
  };
}
