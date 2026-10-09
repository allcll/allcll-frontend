import { QueryCache, QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/lib/errors.ts';
import useToastNotification from '@/features/notification/model/useToastNotification.ts';
import { JolupSteps, useJolupStore } from '@/features/graduation/model/useJolupStore.ts';

const SESSION_ENDED_TAG = 'session-ended';
/** 서버는 세션이 끊긴 이유를 구분하지 못해 두 코드가 같은 상황에서 옵니다. */
const SESSION_ENDED_CODES = ['SESSION_EXPIRED', 'SESSION_NOT_FOUND'];

/**
 * 로그인이 끊겼을 때 알립니다.
 * 로그인한 적 없는 사용자에게는 어색해서, 진행 중이던 스텝이 있을 때만 띄웁니다.
 */
function notifySessionEnded(error: unknown) {
  if (!(error instanceof ApiError)) return;
  if (!SESSION_ENDED_CODES.includes(error.code)) return;
  if (useJolupStore.getState().step === JolupSteps.LOGIN) return;

  const { messages, addToast } = useToastNotification.getState();

  // 졸업요건 대시보드는 쿼리 세 개를 동시에 돌려 onError 도 세 번 불립니다.
  if (messages.some(message => message.tag === SESSION_ENDED_TAG)) return;

  addToast('로그인이 만료되었습니다', SESSION_ENDED_TAG);
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: notifySessionEnded,
    }),
  });
}
