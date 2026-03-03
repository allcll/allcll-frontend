import { useEffect, useMemo, useState } from 'react';
import useFeedbackStore from '@/features/feedback/model/useFeedbackStore';

type FeedbackTab = 'major' | 'general' | 'certification';
export type FeedbackOpenMode = 'auto' | 'manual';

type UseFeedbackTriggerOptions = {
  enabled?: boolean;
  isMobile?: boolean;
  activeTab?: FeedbackTab;
};

function getPageDepth(): number {
  const doc = document.documentElement;
  const scrollTop = window.scrollY || doc.scrollTop || 0;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  return scrollHeight > 0 ? scrollTop / scrollHeight : 1;
}

/**
 * useFeedbackTrigger
 * - returns modal state and onClose handler
 * - automatically opens when user stayed >=5s and scroll depth >=80% and 5s idle
 */
export function useFeedbackTrigger({ enabled = true, isMobile = false, activeTab }: UseFeedbackTriggerOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [openMode, setOpenMode] = useState<FeedbackOpenMode>('auto');
  const [visitedTabs, setVisitedTabs] = useState<Record<FeedbackTab, boolean>>({
    major: false,
    general: false,
    certification: false,
  });
  const dontShowAgain = useFeedbackStore(s => s.dontShowAgain);

  useEffect(() => {
    if (!isMobile) return;
    if (!activeTab) return;

    setVisitedTabs(prev => ({
      ...prev,
      [activeTab]: true,
    }));
  }, [activeTab, isMobile]);

  const isAllTabsVisited = useMemo(() => {
    return visitedTabs.major && visitedTabs.general && visitedTabs.certification;
  }, [visitedTabs]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const checkAndOpen = () => {
      if (hasShown) return;
      if (dontShowAgain) return;

      const depth = getPageDepth();

      if (!isMobile) {
        if (depth >= 0.6) {
          setOpenMode('auto');
          setIsOpen(true);
          setHasShown(true);
        }
        return;
      }

      if (isAllTabsVisited && depth >= 0.8) {
        setOpenMode('auto');
        setIsOpen(true);
        setHasShown(true);
      }
    };

    window.addEventListener('scroll', checkAndOpen, { passive: true });
    checkAndOpen();

    return () => {
      window.removeEventListener('scroll', checkAndOpen);
    };
  }, [enabled, dontShowAgain, hasShown, isMobile, isAllTabsVisited]);

  return {
    isOpen,
    openMode,
    onClose: () => setIsOpen(false),
    open: (mode: FeedbackOpenMode = 'manual') => {
      setOpenMode(mode);
      setIsOpen(true);
    },
  };
}

export default useFeedbackTrigger;
