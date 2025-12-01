import type { UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//인증정보 설정, 인증정보 조회 관련 훅
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { getSessionConfig } from '@/utils/sessionConfig.ts';
import useToastNotification from '@allcll/common/store/useToastNotification';

export const REFETCH_INTERVAL = 15 * 1000; // 15초

const postAdminSessions = async (sessions: Session) => {
  const response = await fetchOnAPI('/api/admin/session', { method: 'POST', body: JSON.stringify(sessions) });

  const responseBody = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', sessions);
    throw new Error(responseBody);
  }

  await addRequestLog(response, 'POST', sessions);

  return response;
};

const getAdminSessions = async (userId: string) => {
  return await fetchJsonOnAPI<Session>(`/api/admin/session?userId=${encodeURIComponent(userId)}`);
};

/**
 * userId의 인증 정보를 조회합니다.
 * queryKey에 userId를 포함해 캐시를 사용자별로 구분합니다.
 * @param userId - 학번 또는 사용자 식별값
 */

interface Session {
  tokenJ: string;
  tokenU: string;
  tokenR: string;
  tokenL: string;
  [key: string]: string;
}

export function useAdminSession(): UseQueryResult<Session, Error> {
  const session = getSessionConfig();

  return useQuery<Session, Error>({
    queryKey: ['sessions', session?.userId ?? ''],
    queryFn: () => getAdminSessions(session?.userId ?? ''),
    enabled: !!session && !session.session && !session.userId,
  });
}

/**
 * 인증 정보를 설정합니다.
 * 성공 시 해당 userId(user tokenU) 캐시만 무효화합니다.
 * tokenU가 없으면 전체 sessions 캐시를 무효화합니다.
 * @returns
 */
export function usePostAdminSession() {
  const queryClient = useQueryClient();

  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: postAdminSessions,

    onSuccess: (_data, variables) => {
      if (variables?.tokenU) {
        queryClient.invalidateQueries({ queryKey: ['sessions', variables.tokenU] }).then();
        localStorage.setItem('userId', variables.tokenU || '');
      } else {
        queryClient.invalidateQueries({ queryKey: ['sessions'] }).then();
      }

      toast('인증 정보가 성공적으로 업데이트되었습니다.');
    },

    onError: err => {
      console.error(err);
      toast('인증 정보 설정에 실패했습니다.');
    },
  });
}

interface UserSessionStatus {
  userId: string;
  isActive: boolean;
  startTime: string | null;
}

interface UserSessionStatusResponse {
  userSessionStatusResponses: UserSessionStatus[];
}

const getUserSessonStatus = async () => {
  return await fetchJsonOnAPI<UserSessionStatusResponse>(`/api/admin/sessions/check`);
};

/**
 *
 * @returns userId, isActive, startTime
 */
export function useCheckAdminSession() {
  return useQuery({
    queryKey: ['check-admin-session'],
    queryFn: () => getUserSessonStatus(),
    refetchInterval: REFETCH_INTERVAL,
    select: data => data.userSessionStatusResponses,
  });
}
