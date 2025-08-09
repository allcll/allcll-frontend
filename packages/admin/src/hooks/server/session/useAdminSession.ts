//인증정보 설정, 인증정보 조회 관련 훅
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { Session } from '@/utils/type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const postAdminSessions = async (sessions: Session) => {
  const response = await fetchOnAPI('/api/admin/session', { method: 'POST', body: JSON.stringify(sessions) });

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

const getAdminsessions = async (userId: string) => {
  return await fetchJsonOnAPI<Session>(`/api/admin/session?userId=${encodeURIComponent(userId)}`);
};

/**
 * userId의 인증 정보를 조회합니다.
 * queryKey에 userId를 포함해 캐시를 사용자별로 구분합니다.
 * @param userId - 학번 또는 사용자 식별값
 */
export function useAdminSession(userId: string) {
  return useQuery({
    queryKey: ['sessions', userId],
    queryFn: () => getAdminsessions(userId),
    enabled: !!userId,
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
  return useMutation({
    mutationFn: postAdminSessions,

    onSuccess: (_data, variables) => {
      if (variables?.tokenU) {
        queryClient.invalidateQueries({ queryKey: ['sessions', variables.tokenU] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['sessions'] });
      }
    },

    onError: err => console.error(err),
  });
}
