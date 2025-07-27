import { useEffect, useRef, useState } from 'react';
import { Subject, Wishes } from '@/utils/types.ts';

const PAGE_SIZE = 45;

function useInfScroll(data: Wishes[] | Subject[]) {
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
      observer.disconnect();
    };
  }, [data]); // data가 변경될 때마다 옵저버를 다시 설정

  return { visibleRows, loadMoreRef };
}

export default useInfScroll;
