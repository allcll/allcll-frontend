import type { UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//인증정보 설정, 인증정보 조회 관련 훅
import { fetchJsonOnAPI, fetchOnAPI } from '@/utils/api';
import { addRequestLog } from '@/utils/log/adminApiLogs';
import { getSessionConfig } from '@/utils/sessionConfig.ts';
import { useToastNotification } from '@allcll/common';

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

export interface SsoLoginRequest {
  studentId: string;
  password: string;
}

interface SsoLoginResponse {
  userId: string;
}

const postSsoLogin = async (request: SsoLoginRequest): Promise<SsoLoginResponse> => {
  const response = await fetchOnAPI('/api/admin/session/sso', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  const responseBody = await response.text();

  /** 요청 로그는 IndexedDB에 남아 로그 화면에 그대로 표시된다. 비밀번호가 브라우저에 평문으로 저장되지 않도록 학번만 기록한다. */
  await addRequestLog(response, 'POST', { studentId: request.studentId });

  if (!response.ok) {
    throw new Error(extractErrorMessage(responseBody));
  }

  return JSON.parse(responseBody) as SsoLoginResponse;
};

/** 백엔드는 실패 시 {code, message} 형태로 응답한다. 원인을 구분할 수 있도록 메시지를 꺼내 쓴다. */
const extractErrorMessage = (responseBody: string): string => {
  try {
    return JSON.parse(responseBody).message ?? responseBody;
  } catch {
    return responseBody;
  }
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

    onSuccess: async (_data, variables) => {
      if (variables?.tokenU) {
        await queryClient.invalidateQueries({ queryKey: ['sessions', variables.tokenU] });
        localStorage.setItem('userId', variables.tokenU || '');
      } else {
        await queryClient.invalidateQueries({ queryKey: ['sessions'] });
      }

      /**요청 성공시, session 상태도 무효화 -> 다시 GET요청 */
      await queryClient.invalidateQueries({ queryKey: ['check-session'] });

      toast('인증 정보가 성공적으로 업데이트되었습니다.');
    },

    onError: err => {
      console.error(err);
      toast('인증 정보 설정에 실패했습니다.');
    },
  });
}

/**
 * 학번과 비밀번호로 수강신청 시스템 세션을 수립합니다.
 * 응답으로 받은 userId는 이후 세션 갱신과 크롤링 요청이 그대로 사용하므로 localStorage에 저장합니다.
 */
export function usePostSsoLogin() {
  const queryClient = useQueryClient();
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: postSsoLogin,

    onSuccess: async data => {
      localStorage.setItem('userId', data.userId);

      await queryClient.invalidateQueries({ queryKey: ['sessions', data.userId] });
      await queryClient.invalidateQueries({ queryKey: ['check-session'] });

      toast('인증 정보가 성공적으로 설정되었습니다.');
    },

    onError: (err: Error) => {
      console.error(err);
      toast(err.message || '인증 정보 설정에 실패했습니다.');
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
    queryKey: ['check-session'],
    queryFn: () => getUserSessonStatus(),
    refetchInterval: REFETCH_INTERVAL,
    select: data => data.userSessionStatusResponses,
  });
}
