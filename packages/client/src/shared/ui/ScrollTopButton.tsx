import { ArrowRightIcon } from '@allcll/allcll-ui';
import useScrollToTop from '@/shared/lib/useScrollTop.ts';
import FloatingButton from './FloatingButton';

function ScrollToTopButton() {
  const { isVisible, scrollToTop } = useScrollToTop(200);

  return (
    <FloatingButton
      label="맨 위로 가기"
      icon={<ArrowRightIcon className="w-5 h-5 -rotate-90 text-primary-500" />}
      className={isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      onClick={scrollToTop}
    />
  );
}

export default ScrollToTopButton;
