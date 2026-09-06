import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/lib/errors.ts';
import useToastNotification from '@/features/notification/model/useToastNotification.ts';

const SESSION_EXPIRED_TAG = 'session-expired';

/**
 * 로그인이 끊겼을 때만 알립니다.
 * SESSION_NOT_FOUND 는 로그인한 적 없는 정상 상태라 제외합니다.
 */
function notifySessionExpired(error: unknown) {
  if (!(error instanceof ApiError)) return;
  if (error.code !== 'SESSION_EXPIRED') return;

  const { messages, addToast } = useToastNotification.getState();

  // 졸업요건 대시보드는 쿼리 세 개를 동시에 돌려 onError 도 세 번 불립니다.
  if (messages.some(message => message.tag === SESSION_EXPIRED_TAG)) return;

  addToast('로그인이 만료되었습니다', SESSION_EXPIRED_TAG);
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: notifySessionExpired,
    }),
  });
}
