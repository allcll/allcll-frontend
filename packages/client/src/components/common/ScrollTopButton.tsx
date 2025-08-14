import RightArrowSvg from '@/assets/right-arrow.svg?react';
import useScrollToTop from '@/hooks/useScrollTop';

interface ScrollToTopButtonProps {
  right?: string;
  bottom?: string;
}

function ScrollToTopButton({ right = 'right-4', bottom = 'bottom-4' }: ScrollToTopButtonProps) {
  const { isVisible, scrollToTop } = useScrollToTop(200);

  return (
    <button
      aria-label="맨 위로 가기"
      className={`fixed ${bottom} ${right} z-50 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg 
                  hidden sm:flex justify-center items-center cursor-pointer transition-opacity duration-200
                  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={scrollToTop}
    >
      <RightArrowSvg className="w-6 h-6 -rotate-90" />
    </button>
  );
}

export default ScrollToTopButton;
