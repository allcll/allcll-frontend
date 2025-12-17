import { useEffect, useRef, useState } from 'react';
import { Subject, Wishes } from '@/utils/types.ts';
import { Lecture } from '../../hooks/server/useLectures.ts';

const PAGE_SIZE = 45;

type UseInfiniteScrollMode = 'ref' | 'selector';

function useInfScroll(
  data: Wishes[] | Subject[] | Lecture[],
  mode: UseInfiniteScrollMode = 'ref',
  selector: string = '.load-more-trigger',
) {
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setVisibleRows(PAGE_SIZE);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleRows(prev => prev + PAGE_SIZE);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 },
    );

    observerRef.current = observer;

    if (mode === 'ref' && loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    } else if (mode === 'selector') {
      const targets = document.querySelectorAll(selector);
      targets.forEach(target => observer.observe(target));
    }

    return () => {
      observer.disconnect();
    };
  }, [data, mode, selector]);

  return {
    visibleRows,
    ...(mode === 'ref' ? { loadMoreRef } : {}),
  };
}

export default useInfScroll;
