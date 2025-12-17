import RightArrowSvg from '@/assets/right-arrow.svg?react';
import useScrollToTop from '@/shared/lib/useScrollTop.ts';

interface ScrollToTopButtonProps {
  right?: string;
  bottom?: string;
}

function ScrollToTopButton({ right = 'right-2 sm:right-10', bottom = 'bottom-4' }: ScrollToTopButtonProps) {
  const { isVisible, scrollToTop } = useScrollToTop(200);

  return (
    <button
      aria-label="맨 위로 가기"
      className={`fixed ${bottom} ${right} z-50 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg 
                  flex justify-center items-center cursor-pointer transition-opacity duration-200
                  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={scrollToTop}
    >
      <RightArrowSvg className="w-6 h-6 -rotate-90" />
    </button>
  );
}

export default ScrollToTopButton;
