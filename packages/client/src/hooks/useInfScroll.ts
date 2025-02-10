import {useEffect, useRef, useState} from 'react';
import {Subject, Wishes} from "@/utils/types.ts";

// .load-more-trigger 인 항목 추가
function useInfScroll(data: Wishes[] | Subject[]) {
  const [visibleRows, setVisibleRows] = useState(200);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setVisibleRows(200);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleRows((prev) => prev + 200);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    observerRef.current = observer;

    const targets = document.querySelectorAll('.load-more-trigger');
    targets.forEach((target) => observer.observe(target));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {visibleRows};
}

export default useInfScroll;
