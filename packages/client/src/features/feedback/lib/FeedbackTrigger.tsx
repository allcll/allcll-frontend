import { useEffect, useRef, useState } from 'react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';

/**
 * useFeedbackTrigger
 * - returns modal state and onClose handler
 * - automatically opens when user stayed >=5s and scroll depth >=80% and 5s idle
 */
export function useFeedbackTrigger(enabled = true) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);

  const startTs = useRef<number>(Date.now());
  const lastInteraction = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    startTs.current = Date.now();
    lastInteraction.current = Date.now();

    const updateInteraction = () => {
      lastInteraction.current = Date.now();
    };

    window.addEventListener('scroll', updateInteraction, { passive: true });
    window.addEventListener('click', updateInteraction);
    window.addEventListener('keydown', updateInteraction);
    window.addEventListener('touchstart', updateInteraction, { passive: true });
    window.addEventListener('mousemove', updateInteraction);

    const checkInterval = setInterval(() => {
      if (hasShown) return;
      if (dontShowAgain) return;

      const now = Date.now();
      const stayed = now - startTs.current >= 5000; // 5s
      if (!stayed) return;

      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const depth = scrollHeight > 0 ? scrollTop / scrollHeight : 1;

      if (depth >= 0.6) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 500);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener('scroll', updateInteraction);
      window.removeEventListener('click', updateInteraction);
      window.removeEventListener('keydown', updateInteraction);
      window.removeEventListener('touchstart', updateInteraction);
      window.removeEventListener('mousemove', updateInteraction);
    };
  }, [enabled, dontShowAgain, hasShown]);

  return { isOpen, onClose: () => setIsOpen(false), open: () => setIsOpen(true) };
}

export default useFeedbackTrigger;
