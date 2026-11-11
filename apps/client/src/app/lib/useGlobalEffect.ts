import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { settleConfirm } from '@allcll/common';
import useSSEManager from '@/features/live/common/api/useSSEManager';

interface IHistory {
  key?: string;
  idx: number;
  usr?: null;
}

const DefaultHistory: IHistory = { idx: -1, key: '' };

// 레이아웃이 바뀌면 이 훅도 새로 마운트되므로, 이전 경로는 모듈에 기억함
let lastPathname: string | null = null;

function useGlobalEffect() {
  const location = useLocation();
  const history = useRef<IHistory>(DefaultHistory);

  // Scroll to top when navigating
  useEffect(() => {
    const h = window.history.state;
    if (!h || h.idx >= history.current.idx) {
      window.scrollTo(0, 0);
    }

    history.current = h ?? DefaultHistory;
  }, [location.pathname]);

  // 확인창이 열린 채 페이지가 바뀌면 취소로 닫아, 이전 페이지의 동작이 나중에 실행되지 않게 함
  useEffect(() => {
    if (lastPathname !== null && lastPathname !== location.pathname) settleConfirm(false);
    lastPathname = location.pathname;
  }, [location.pathname]);

  // SSEManager.ts
  useSSEManager();
}

export default useGlobalEffect;
