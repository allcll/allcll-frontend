import { useEffect } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { onChangePinned } from '@/hooks/useNotification.ts';
import { NonMajorSeats, PinnedSeats } from '@/utils/types.ts';
import useSSECondition, { RELOAD_INTERVAL, RELOAD_MAX_COUNT } from '@/store/useSSECondition.ts';
import { fetchEventSource } from '@/utils/api.ts';

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

  // connection
  useEffect(() => {
    const reload = alwaysReload || needCount > 0;

    if (isConnected || !reload || errorCount >= RELOAD_MAX_COUNT) {
      return;
    }

    isConnected = true;
    fetchSSEData(queryClient, resetError)
      .then(() => {
        resetError();
        isConnected = false;
      })
      .catch(() => {
        setError();
        setTimeout(() => {
          isConnected = false;
        }, RELOAD_INTERVAL);
      });
  }, [alwaysReload, needCount, queryClient, setError, forceReloadNumber, resetError, errorCount]);
  // 조건이 바뀌었을 때, 연결이 끊어졌을 때 다시 연결
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
    });

    eventSource.addEventListener('majorSeats', event => {
      const json = JSON.parse(event.data);
      if (!json) return;
      const next: PinnedSeats[] = json.seatResponses ?? [];

      queryClient.setQueryData<PinnedSeats[]>([SSEType.MAJOR as string], (prev = []) => mergeUpdatedOnly(prev, next));
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
    });

    eventSource.onopen = () => {
      resetError();
    };

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      resolve(data);
    };

    eventSource.onerror = error => {
      eventSource.close();
      reject(new Error('SSE connection error: ' + (error.type ?? 'Unknown error')));
    };

    return () => {
      eventSource.close();
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

type SSESeats = NonMajorSeats | PinnedSeats;

function mergeUpdatedOnly<T extends SSESeats>(prev: T[], next: T[]) {
  const updated: T[] = [];

  for (const nextItem of next) {
    const prevItem = prev.find(p => p.subjectId === nextItem.subjectId);
    const isChanged =
      !prevItem || prevItem.seatCount !== nextItem.seatCount || prevItem.queryTime !== nextItem.queryTime;

    if (isChanged) {
      updated.push(nextItem);
    } else {
      updated.push(prevItem);
    }
  }

  return updated;
}

function mergeUpdated<T extends SSESeats>(prev: T[], next: T[]) {
  const ids = new Set<number>();

  [...prev, ...next].forEach(item => {
    ids.add(item.subjectId);
  });

  const result: T[] = [];
  ids.forEach(id => {
    const prevItem = prev.find(item => item.subjectId === id);
    const nextItem = next.find(item => item.subjectId === id);

    const isNextItem =
      nextItem && (!prevItem || prevItem.queryTime !== nextItem.queryTime || prevItem.seatCount !== nextItem.seatCount);

    if (isNextItem) {
      result.push(nextItem);
    } else if (prevItem) {
      result.push(prevItem);
    }
  });

  return result;
}

export default useSSEManager;
