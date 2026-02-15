import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchGraduationCheck } from '@/entities/graduation/api/graduation';
import { graduationQueryKeys } from '@/entities/graduation/model/useGraduation';
import { JolupSteps } from './useJolupSteps';

export function useInitialGraduationCheck(isRetry: boolean = false) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['initial', 'graduationCheck'],
    queryFn: fetchGraduationCheck,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (query.data) {
      queryClient.setQueryData(graduationQueryKeys.check(), query.data);
    }
  }, [query.data, queryClient]);

  const initialStep = useMemo(() => {
    if (query.isLoading) return null;

    return determineStep(query.isError, query.error, !!query.data?.data, isRetry);
  }, [query.isLoading, query.isError, query.error, query.data, isRetry]);

  return { ...query, initialStep };
}

// 초기 진입 판단 로직
function determineStep(isError: boolean, error: Error | null, hasData: boolean, isRetry: boolean): JolupSteps | null {
  if (isError && error) {
    const message = error.message;

    if (message.includes('401') || message.includes('Unauthorized')) {
      return JolupSteps.LOGIN;
    }
    if (message.includes('학과') || message.includes('Major') || message.includes('기본 정보')) {
      return JolupSteps.DEPARTMENT_INFO;
    }

    if (message.includes('파일')) {
      return JolupSteps.FILE_UPLOAD;
    }

    if (message.includes('GRADUATION_CHECK_NOT_FOUND') || message.includes('검사 결과를 찾을 수 없습니다')) {
      return JolupSteps.DEPARTMENT_INFO;
    }

    return null;
  }

  if (hasData) {
    return isRetry ? JolupSteps.DEPARTMENT_INFO : JolupSteps.RESULT;
  }

  return null;
}
