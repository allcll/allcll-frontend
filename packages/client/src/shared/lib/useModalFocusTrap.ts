import { useEffect } from 'react';
import type { RefObject } from 'react';

interface IUseModalFocusTrap {
  containerRef: RefObject<HTMLElement | null>;
  resetKey?: unknown;
}

/**
 * Tab 포커스를 모달 내 버튼 안에서만 순환시키는 포커스 트랩입니다.
 * 포커스가 모달 밖(body 포함)에 있으면 첫 버튼으로 이동시킵니다.
 * @param containerRef 모달을 감싸는 요소의 ref
 * @param resetKey 값이 바뀔 때마다 이전 포커스를 초기화합니다 (예: 모달 상태)
 */
function useModalFocusTrap({ containerRef, resetKey }: IUseModalFocusTrap) {
  // 모달 상태 전환 시 이전 버튼에 남은 포커스 초기화
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [resetKey]);

  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const buttons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not([tabindex="-1"])'),
      );
      if (buttons.length === 0) return;

      const firstButton = buttons[0];
      const lastButton = buttons[buttons.length - 1];
      const active = document.activeElement;

      if (!(active instanceof HTMLButtonElement) || !buttons.includes(active)) {
        e.preventDefault();
        firstButton.focus();
      } else if (e.shiftKey && active === firstButton) {
        e.preventDefault();
        lastButton.focus();
      } else if (!e.shiftKey && active === lastButton) {
        e.preventDefault();
        firstButton.focus();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [containerRef]);
}

export default useModalFocusTrap;
