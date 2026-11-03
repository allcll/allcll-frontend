import { useEffect, useRef, useState } from 'react';
import { Subject, Wishes } from '@/shared/model/types.ts';
import { Lecture } from '@/entities/subjects/model/useLectures.ts';

const PAGE_SIZE = 45;

function useInfScroll<T extends HTMLElement = HTMLDivElement>(data: Wishes[] | Subject[] | Lecture[]) {
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<T | null>(null);

  useEffect(() => {
    setVisibleRows(PAGE_SIZE);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleRows(prev => {
              if (prev >= data.length) return prev;
              return prev + PAGE_SIZE;
            });
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [data]);

  return { visibleRows, loadMoreRef };
}

export default useInfScroll;
