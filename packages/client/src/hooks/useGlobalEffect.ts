import {useLocation} from 'react-router-dom';
import {useEffect, useRef} from 'react';
import useSSEManager from "@/hooks/useSSEManager.ts";

interface IHistory {
  key?: string;
  idx: number;
  usr?: null;
}

const DefaultHistory: IHistory = {idx: -1, key: ''};

function useGlobalEffect() {
  const location = useLocation();
  const history = useRef<IHistory>(DefaultHistory);

  // Scroll to top when navigating
  useEffect(() => {
    const h = window.history.state;
    if (!h || h.idx >= history.current.idx) {
      window.scrollTo(0, 0);
    }

    history.current = h || DefaultHistory;
  }, [location.pathname]);

  // SSEManager.ts
  useSSEManager();
}

export default useGlobalEffect;