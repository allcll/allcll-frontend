import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 바텀 시트가 열린 상태에서 뒤로가기 액션이 발생하면 페이지를 벗어나는 대신 시트만 닫습니다.
 * popstate 시점에는 이미 이전 페이지로 이동한 뒤기에 시트를 열었던 경로로 되돌립니다.
 */
function useCloseBottomSheetOnBackKey(onClose: () => void) {
  const navigate = useNavigate();
  const location = useLocation();

  // 시트를 연 시점의 경로
  const openedAt = useRef(`${location.pathname}${location.search}`);
  const handleBackRef = useRef<() => void>(() => {});

  useEffect(() => {
    handleBackRef.current = () => {
      navigate(openedAt.current);
      onClose();
    };
  });

  useEffect(() => {
    const handleBack = () => handleBackRef.current();

    window.addEventListener('popstate', handleBack);
    return () => {
      window.removeEventListener('popstate', handleBack);
    };
  }, []);
}

export default useCloseBottomSheetOnBackKey;
