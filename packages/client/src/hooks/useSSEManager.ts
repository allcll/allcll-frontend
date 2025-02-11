import {useEffect, useState} from 'react';
import {QueryClient, useQuery, useQueryClient} from '@tanstack/react-query';
import {onChangePinned} from "@/hooks/useNotification.ts";
import {PinnedSeats} from "@/utils/types.ts";
import useSSECondition from "@/store/useSSECondition.ts";

export enum SSEType {
  NON_MAJOR = 'nonMajorSeats',
  MAJOR = 'majorSeats',
  PINNED = 'pinSeats',
}

const useSSEManager = () => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const needCount = useSSECondition((state) => state.needCount);
  const alwaysReload = useSSECondition((state) => state.alwaysReload);
  const forceReloadNumber = useSSECondition((state) => state.forceReloadNumber);
  const setError = useSSECondition((state) => state.setError);

  // connection
  useEffect(() => {
    const reload = alwaysReload || needCount > 0;
    console.log('needReconnect', alwaysReload, needCount, reload);

    if (isConnected || !reload) {
      return;
    }

    setIsConnected(true);
    fetchSSEData(queryClient)
      .catch(() => setError(true))
      .finally(() => setIsConnected(false));
  }, [alwaysReload, isConnected, needCount, queryClient, setError, forceReloadNumber]);
  // 조건이 바뀌었을 때, 연결이 끊어졌을 때 다시 연결
}

const fetchSSEData = (queryClient: QueryClient) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource('/api/connect');

    eventSource.addEventListener('nonMajorSeats', (event) => {
      queryClient.setQueryData([SSEType.NON_MAJOR as string], JSON.parse(event.data).seatResponses);
    });

    eventSource.addEventListener('majorSeats', (event) => {
      queryClient.setQueryData([SSEType.MAJOR as string], JSON.parse(event.data).seatResponses);
    });

    eventSource.addEventListener('pinSeats', (event) => {
      queryClient.setQueryData([SSEType.PINNED as string], (prev: PinnedSeats[]) => {
        const now: PinnedSeats[] = JSON.parse(event.data).seatResponses;
        onChangePinned(prev, now, queryClient);

        return now;
      });
    });


    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      resolve(data);
    };

    eventSource.onerror = (error) => {
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
  const addNeedCount = useSSECondition((state) => state.addNeedCount);
  const deleteNeedCount = useSSECondition((state) => state.deleteNeedCount);

  

  useEffect(() => {

    addNeedCount();
    return () => {
      deleteNeedCount();
    };
  }, [addNeedCount, deleteNeedCount]);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('visibilityChange', document.visibilityState);

      if (document.visibilityState === 'visible') {
        addNeedCount();
      } else {
        deleteNeedCount();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [addNeedCount, deleteNeedCount]);
  
  return useQuery<PinnedSeats[]>({
    queryKey: [type as string],
    queryFn: () => new Promise((resolve) => {
      resolve(queryClient.getQueryData([type as string]) ?? []);
    }),
  });
};

export default useSSEManager;