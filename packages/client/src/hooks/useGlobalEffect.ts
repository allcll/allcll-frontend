import {useLocation} from 'react-router-dom';
import {useEffect, useRef} from 'react';

interface IHistory {
  key?: string;
  idx: number;
  usr?: null;
}

const DefaultHistory: IHistory = {idx: -1, key: ''};

function useGlobalEffect() {
  const location = useLocation();
  const history = useRef<IHistory>(DefaultHistory);

  useEffect(() => {
    const h = window.history.state;
    if (!h || h.idx >= history.current.idx) {
      window.scrollTo(0, 0);
    }

    history.current = h || DefaultHistory;
  }, [location.pathname]);
}

export default useGlobalEffect;