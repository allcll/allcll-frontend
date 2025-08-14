import { useState, useEffect } from 'react';

function useScrollToTop(threshold: number = 200) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > threshold);
    onScroll(); // 초기 상태 반영
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { isVisible, scrollToTop };
}

export default useScrollToTop;
