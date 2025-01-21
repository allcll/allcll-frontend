import { useEffect } from 'react';
import { useStore } from './store';

const useSSE = () => {
  const updateSeats = useStore((state) => state.updateSeats);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');

    eventSource.onmessage = (event) => {
      const { id, seats } = JSON.parse(event.data);
      updateSeats(id, seats);
    };

    return () => {
      eventSource.close();
    };
  }, [updateSeats]);
};

export default useSSE;