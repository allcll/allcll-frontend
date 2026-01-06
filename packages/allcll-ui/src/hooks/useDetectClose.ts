import { useEffect, type RefObject } from 'react';

interface UseDetectCloseProps {
  elem: RefObject<HTMLButtonElement | HTMLDivElement | null>;
  tabRefs: RefObject<HTMLDivElement | HTMLButtonElement | null>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useDetectClose = ({ elem, tabRefs, isOpen, open, close }: UseDetectCloseProps) => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const tabRefArray = Array.isArray(tabRefs) ? tabRefs : [tabRefs];

      const isTabClick = tabRefArray.some(tabRef => tabRef.current && tabRef.current.contains(e.target as Node));

      if (isTabClick) {
        open();
      } else if (elem.current && !elem.current.contains(e.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      window.addEventListener('click', onClick);
    } else {
      window.removeEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, elem, tabRefs]);
};

export default useDetectClose;
