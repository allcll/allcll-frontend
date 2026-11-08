import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchGraduationCheck } from '@/entities/graduation/api/graduation';
import { graduationQueryKeys } from '@/entities/graduation/model/useGraduation';
import { JolupSteps } from '../model/useJolupStore';
import { stepForError } from './stepForError.ts';

export function useInitialGraduationCheck(isRetry: boolean = false, skipInfo: boolean = false) {
  const queryClient = useQueryClient();
  const query = useQuery({
    // 로그아웃처럼 졸업 캐시를 비우는 곳에서 같이 지워지도록 graduation 아래에 둡니다.
    queryKey: [...graduationQueryKeys.all, 'initialCheck'],
    queryFn: fetchGraduationCheck,
    refetchOnWindowFocus: false,
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

    return determineStep(query.isError, query.error, !!query.data, isRetry, skipInfo);
  }, [query.isLoading, query.isError, query.error, query.data, isRetry, skipInfo]);

  return { ...query, initialStep };
}

// 초기 진입 판단 로직
function determineStep(
  isError: boolean,
  error: Error | null,
  hasData: boolean,
  isRetry: boolean,
  skipInfo: boolean,
): JolupSteps {
  if (isError && error) {
    return stepForError(error);
  }

  if (hasData) {
    if (!isRetry) return JolupSteps.RESULT;
    return skipInfo ? JolupSteps.FILE_UPLOAD : JolupSteps.DEPARTMENT_INFO;
  }

  return JolupSteps.LOGIN;
}
