import { useEffect, useState } from 'react';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { onChangePinned } from '@/hooks/useNotification.ts';
import { PinnedSeats } from '@/utils/types.ts';
import useSSECondition, { RELOAD_INTERVAL, RELOAD_MAX_COUNT } from '@/store/useSSECondition.ts';

export enum SSEType {
  NON_MAJOR = 'nonMajorSeats',
  MAJOR = 'majorSeats',
  PINNED = 'pinSeats',
}

const useSSEManager = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
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

    setIsConnected(true);
    fetchSSEData(queryClient, resetError)
      .then(() => {
        resetError();
        setIsConnected(false);
      })
      .catch(() => {
        setError();
        setTimeout(() => {
          setIsConnected(false);
        }, RELOAD_INTERVAL);
      });
  }, [alwaysReload, isConnected, needCount, queryClient, setError, forceReloadNumber, resetError, errorCount]);
  // 조건이 바뀌었을 때, 연결이 끊어졌을 때 다시 연결
};

const fetchSSEData = (queryClient: QueryClient, resetError: () => void) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource('/api/connect');

    eventSource.addEventListener('nonMajorSeats', event => {
      const json = JSON.parse(event.data);
      if (json) queryClient.setQueryData([SSEType.NON_MAJOR as string], json.seatResponses);
    });

    eventSource.addEventListener('majorSeats', event => {
      const json = JSON.parse(event.data);
      if (json) queryClient.setQueryData([SSEType.MAJOR as string], json.seatResponses);
    });

    eventSource.addEventListener('pinSeats', event => {
      queryClient.setQueryData([SSEType.PINNED as string], (prev: PinnedSeats[]) => {
        const json = JSON.parse(event.data);
        if (!json) return prev;

        const now: PinnedSeats[] = json.seatResponses;
        for (const pinned of prev) {
          const find = now.find(seat => seat.subjectId === pinned.subjectId);
          if (!find) now.push(pinned);
        }

        onChangePinned(prev, now, queryClient);

        return now;
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
      reject(error);
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

  return useQuery<PinnedSeats[]>({
    queryKey: [type as string],
    queryFn: () =>
      new Promise(resolve => {
        resolve(queryClient.getQueryData([type as string]) ?? []);
      }),
  });
};

export default useSSEManager;
