import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 45;

function useInfScroll<T extends HTMLElement = HTMLDivElement>(data: readonly unknown[]) {
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
      // 끝에 닿은 뒤 불러오면 페이지 길이가 잠깐 짧아져 sticky 요소가 밀려 올라가므로 미리 불러옴
      { root: null, rootMargin: '0px 0px 800px 0px', threshold: 0.5 },
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
