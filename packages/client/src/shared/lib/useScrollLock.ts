import { useEffect } from 'react';

/**
 * 잠금은 body 의 인라인 스타일이 아니라 html 의 클래스로 겁니다.
 * 광고 스크립트가 body 의 overflow 를 인라인으로 덮어써서, 같은 자리를 쓰면
 * 서로의 값을 지우거나 남이 남긴 값을 되돌리게 됩니다.
 */
const LOCK_CLASS = 'scroll-locked';

// 여러 겹이 동시에 열려도 마지막 하나가 닫힐 때만 풀리도록 셉니다.
let lockCount = 0;

/** 화면을 덮는 UI 가 열려 있는 동안 페이지 스크롤을 막습니다. */
function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockCount += 1;
    if (lockCount === 1) {
      document.documentElement.classList.add(LOCK_CLASS);
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.classList.remove(LOCK_CLASS);
      }
    };
  }, [isLocked]);
}

export default useScrollLock;
