import { useEffect, useRef, useState } from 'react';
import { SimulationSubject, Subject, Wishes } from '@/utils/types.ts';

// 스크롤 3번 정도 사이즈 : 45
const PAGE_SIZE = 45;

// .load-more-trigger 인 항목 추가
function useInfScroll(data: Wishes[] | Subject[] | SimulationSubject[]) {
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE);
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

    const waitAndObserve = () => {
      const target = document.querySelector('.load-more-trigger');
      if (target) {
        observer.observe(target);
      } else {
        setTimeout(waitAndObserve, 100);
      }
    };

    waitAndObserve();

    observerRef.current = observer;

    const targets = document.querySelectorAll('.load-more-trigger');
    targets.forEach(target => observer.observe(target));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { visibleRows };
}

export default useInfScroll;
