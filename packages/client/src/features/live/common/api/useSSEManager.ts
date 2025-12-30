import { useEffect } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlarmNotification, onChangePinned } from '@/features/notification/lib/useNotification.ts';
import { NonMajorSeats, PinnedSeats } from '@/shared/model/types.ts';
import useSSECondition, { RELOAD_INTERVAL, RELOAD_MAX_COUNT } from '@/features/live/board/model/useSSECondition';
import { fetchEventSource } from '@/shared/api/api.ts';
import { useSSEState } from '@/features/live/board/model/useSseState';
import { mergeUpdated, mergeUpdatedOnly } from '../lib/mergeUpdated';

export enum SSEType {
  NON_MAJOR = 'nonMajorSeats',
  MAJOR = 'majorSeats',
  PINNED = 'pinSeats',
}

let isConnected = false;

const useSSEManager = () => {
  const queryClient = useQueryClient();
  const needCount = useSSECondition(state => state.needCount);
  const alwaysReload = useSSECondition(state => state.alwaysReload);
  const forceReloadNumber = useSSECondition(state => state.forceReloadNumber);
  const errorCount = useSSECondition(state => state.errorCount);
  const setError = useSSECondition(state => state.setError);
  const resetError = useSSECondition(state => state.resetError);
  const isError = useSSECondition(state => state.isError);

  // connection
  useEffect(() => {
    const reload = alwaysReload || needCount > 0;

    if (isConnected || !reload || errorCount >= RELOAD_MAX_COUNT) {
      return;
    }

    isConnected = true;
    fetchSSEData(queryClient, resetError)
      .then(() => {
        // 연결이 마감 되었을 때 아님 / 언제 실행되는 지 찾아야 함.
        resetError();
        isConnected = false;
      })
      .catch(() => {
        // 연결이 끊어졌을 때, 오류 상태로 변경
        isConnected = false;

        if (errorCount === 0) setError();
        else setTimeout(setError, RELOAD_INTERVAL);
      });
  }, [alwaysReload, needCount, queryClient, setError, forceReloadNumber, resetError, errorCount]);
  // 조건이 바뀌었을 때, 연결이 끊어졌을 때 다시 연결

  // 에러가 발생했을 때, 알림을 보내주기
  useEffect(() => {
    if (isError) AlarmNotification.show('알림이 중지되었습니다. 다시 연결해주세요.');
  }, [isError]);
};

const fetchSSEData = (queryClient: QueryClient, resetError: () => void) => {
  return new Promise((resolve, reject) => {
    const eventSource = fetchEventSource('/api/connect');

    eventSource.addEventListener('nonMajorSeats', event => {
      const json = JSON.parse(event.data);
      if (!json) return;
      const next: NonMajorSeats[] = json.seatResponses ?? [];

      queryClient.setQueryData<NonMajorSeats[]>([SSEType.NON_MAJOR as string], (prev = []) =>
        mergeUpdatedOnly(prev, next),
      );

      useSSEState.getState().updated();
    });

    eventSource.addEventListener('majorSeats', event => {
      const json = JSON.parse(event.data);
      if (!json) return;
      const next: PinnedSeats[] = json.seatResponses ?? [];

      queryClient.setQueryData<PinnedSeats[]>([SSEType.MAJOR as string], (prev = []) => mergeUpdatedOnly(prev, next));

      useSSEState.getState().updated();
    });

    eventSource.addEventListener('pinSeats', event => {
      const json = JSON.parse(event.data);
      if (!json) return;
      const next: PinnedSeats[] = json.seatResponses ?? [];

      queryClient.setQueryData<PinnedSeats[]>([SSEType.PINNED as string], (prev = []) => {
        // 신규 과목 데이터에 없는 기존 데이터를 추가 함.
        const nextSeats = mergeUpdated(prev, next);
        onChangePinned(prev, nextSeats, queryClient);

        return nextSeats;
      });

      useSSEState.getState().updated();
    });

    eventSource.onopen = () => {
      resetError();
      useSSEState.getState().updated();
    };

    eventSource.onerror = error => {
      eventSource.close();
      reject(new Error('SSE connection error: ' + (error.type ?? 'Unknown error')));
    };

    return () => {
      eventSource.close();
      resolve('SSE connection closed');
    };
  });
};

export const useSseData = (type: SSEType) => {
  const queryClient = useQueryClient();
  const addNeedCount = useSSECondition(state => state.addNeedCount);
  const deleteNeedCount = useSSECondition(state => state.deleteNeedCount);

  // SSE 상태 관리
  const isPending = useSSECondition(state => state.isPending);
  const isError = useSSECondition(state => state.isError);
  const refetch = useSSECondition(state => state.setForceReload);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        addNeedCount();
      } else {
        deleteNeedCount();
      }
    };

    addNeedCount();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      deleteNeedCount();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [addNeedCount, deleteNeedCount]);

  const query = useQuery<PinnedSeats[]>({
    queryKey: [type as string],
    queryFn: () => Promise.resolve(queryClient.getQueryData([type as string]) ?? []),
  });

  return {
    ...query,
    isPending,
    isError,
    refetch,
  };
};

export default useSSEManager;
