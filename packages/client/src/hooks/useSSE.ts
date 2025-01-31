import {QueryClient, useQuery, useQueryClient} from '@tanstack/react-query';
import { useCallback } from 'react';
import {onChangePinned} from "@/hooks/useNotification.ts";
import {PinnedSeats} from "@/utils/types..ts";

const fetchSSEData = (queryClient: QueryClient) => {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource('/api/connect');

    eventSource.addEventListener('non-major', (event) => {
      // queryClient.invalidateQueries({ queryKey: ['nonMajor'] });
      queryClient.setQueryData(['nonMajor'], JSON.parse(event.data));
    });

    eventSource.addEventListener('major', (event) => {
      // queryClient.invalidateQueries({ queryKey: ['major'] });
      queryClient.setQueryData(['major'], JSON.parse(event.data));
    });

    eventSource.addEventListener('pinned', (event) => {
      // queryClient.invalidateQueries({ queryKey: ['pinned'] });
      queryClient.setQueryData(['pinned'], (prev: PinnedSeats[]) => {
        const now: PinnedSeats[] = JSON.parse(event.data);
        onChangePinned(prev, now);

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

const useSSE = () => {
  const queryClient = useQueryClient();

  const connect = useCallback(
    () => fetchSSEData(queryClient), [queryClient]);

  return useQuery({
    queryKey: ['sseData'],
    queryFn: connect,
    refetchInterval: false
  });
};

export default useSSE;