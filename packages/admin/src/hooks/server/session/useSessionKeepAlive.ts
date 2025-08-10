//인증정보 갱신 취소, 인증정보 갱신 관련 훅
import { fetchOnAPI } from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import useToastNotification from '@allcll/common/store/useToastNotification';
import { addRequestLog } from '@/utils/log/adminApiLogs';

const cancelSessionKeepAlive = async () => {
  const response = await fetchOnAPI(`/api/admin/session/cancel`, {
    method: 'POST',
  });

  const response_body = await response.text();

  if (!response.ok) {
    await addRequestLog(response, 'POST', '');
    throw new Error(response_body);
  }

  await addRequestLog(response, 'POST', '');

  return response;
};

const startSessionKeepAlive = async (userId: string) => {
  const response = await fetchOnAPI(`/api/admin/session-keep-alive?userId=${encodeURIComponent(userId)}`, {
    method: 'POST',
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(await response.text());
  }
};

/**
 * * 세션 KeepAlive 시작 요청입니다.
 * @param userId - 대상 사용자 학번/ID
 * @returns
 */
export function useStartSessionKeepAlive() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: (userId: string) => startSessionKeepAlive(userId),
    onSuccess: async () => {
      toast('세션 KeepAlive이 시작되었습니다.');
    },
    onError: err => console.error(err),
  });
}

/**
 * 세션 KeepAlive 중지를 요청합니다.
 *@param userId - 대상 사용자 학번/ID
 * @returns
 */
export function useCancelSessionKeepAlive() {
  const toast = useToastNotification.getState().addToast;

  return useMutation({
    mutationFn: () => cancelSessionKeepAlive(),
    onSuccess: async () => {
      toast('세션 KeepAlive이 중지되었습니다.');
    },
    onError: err => console.error(err),
  });
}
