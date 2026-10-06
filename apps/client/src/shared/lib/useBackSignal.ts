import { useEffect } from 'react';

interface IUseBackSignal {
  enabled?: boolean;
  onClose?: () => void;
}

function useBackSignal({ enabled = true, onClose }: IUseBackSignal) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (onClose) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
}

export default useBackSignal;
