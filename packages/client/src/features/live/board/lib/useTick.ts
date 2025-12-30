import useTickStore from '@/features/live/board/model/useTickStore.ts';
import { useEffect } from 'react';

// todo: addRefCount, removeRefCount 기능 분리하기
const useTick = (callback?: () => void) => {
  const tick = useTickStore(state => state.tick);
  const addRefCount = useTickStore(state => state.addRefCount);
  const removeRefCount = useTickStore(state => state.removeRefCount);

  useEffect(() => {
    addRefCount();

    return () => {
      removeRefCount();
    };
  }, []);

  useEffect(() => {
    if (callback) callback();
  }, [tick]);
};

export default useTick;
