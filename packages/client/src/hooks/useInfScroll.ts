import { useEffect, useRef, useState } from 'react';
import { SimulationSubject, Subject, Wishes } from '@/utils/types.ts';

// 스크롤 3번 정도 사이즈 : 45
const PAGE_SIZE = 200;

// .load-more-trigger 인 항목 추가
function useInfScroll(data: Wishes[] | Subject[] | SimulationSubject[]) {
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

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
        root: scrollContainerRef.current ?? null,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    const tryObserve = () => {
      const target = scrollContainerRef.current?.querySelector('.load-more-trigger');
      if (target) {
        observer.observe(target);
      } else {
        requestAnimationFrame(tryObserve);
      }
    };

    tryObserve();
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [scrollContainerRef.current]);

  return { visibleRows, scrollContainerRef };
}

export default useInfScroll;
