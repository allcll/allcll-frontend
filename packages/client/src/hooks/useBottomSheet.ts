import { MIN_Y, MAX_Y } from '@/components/contentPanel/bottomSheet/BottomSheet';
import { useRef, useEffect } from 'react';

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number;
    touchY: number;
  };

  touchMove: {
    prevTouchY?: number;
    movingDirection: 'none' | 'down' | 'up';
  };
  isContentAreaTouched: boolean;
}

export default function useBottomSheet() {
  const sheet = useRef<HTMLDivElement>(null);

  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: {
      sheetY: 0,
      touchY: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: 'none',
    },
    isContentAreaTouched: false,
  });

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;

      if (!isContentAreaTouched) {
        return true;
      }

      if (sheet.current!.getBoundingClientRect().y !== MIN_Y) {
        return true;
      }

      if (touchMove.movingDirection === 'down') {
        return content.current!.scrollTop <= 0;
      }
      return false;
    };

    //현재 바텀 시트의 위치와 터치 포인트의 위치
    const handleTouchStart = (e: TouchEvent) => {
      const { touchStart } = metrics.current;
      touchStart.sheetY = sheet.current!.getBoundingClientRect().y;
      touchStart.touchY = e.touches[0].clientY;
    };

    //   이전 touchmove와 비교하여 터치 포인트가 어느 방향으로 진행 중인지와
    //   얼만큼 진행했는지를 계산하고 기록합니다.
    //   그 후 바텀시트를 터치 포인트의 진행 만큼 움직입니다.
    const handleTouchMove = (e: TouchEvent) => {
      const { touchStart, touchMove } = metrics.current;
      const currentTouch = e.touches[0];

      if (touchMove.prevTouchY === undefined) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      if (touchMove.prevTouchY === 0) {
        // 맨 처음 앱 시작하고 시작시
        touchMove.prevTouchY = touchStart.touchY;
      }

      if (touchMove.prevTouchY < currentTouch.clientY) {
        touchMove.movingDirection = 'down';
      }

      if (touchMove.prevTouchY > currentTouch.clientY) {
        touchMove.movingDirection = 'up';
      }

      if (canUserMoveBottomSheet()) {
        e.preventDefault();

        const touchOffset = currentTouch.clientY - touchStart.touchY;
        let nextSheetY = touchStart.sheetY + touchOffset;

        if (nextSheetY <= MIN_Y) {
          nextSheetY = MIN_Y;
        }

        if (nextSheetY >= MAX_Y) {
          nextSheetY = MAX_Y;
        }

        sheet.current!.style.setProperty('transform', `translateY(${nextSheetY}px)`);
      } else {
        document.body.style.overflowY = 'hidden';
      }
    };

    // 유저가 터치를 제거했을 때, 시트를 최상단으로 올리거나 최하단으로 내리는
    //  Snap Animation을 트리거합니다. 그 후 터치 기록들을 초기화 합니다.
    const handleTouchEnd = () => {
      const { touchMove } = metrics.current;

      const currentSheetY = sheet.current!.getBoundingClientRect().y;

      if (currentSheetY !== MIN_Y) {
        if (touchMove.movingDirection === 'down') {
          sheet.current!.style.setProperty('transform', `translateY(${MAX_Y}px)`);
        }

        if (touchMove.movingDirection === 'up') {
          sheet.current!.style.setProperty('transform', `translateY(${MIN_Y}px)`);
        }
      }

      // metrics 초기화.
      metrics.current = {
        touchStart: {
          sheetY: 0,
          touchY: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: 'none',
        },
        isContentAreaTouched: false,
      };
    };

    sheet.current!.addEventListener('touchstart', handleTouchStart);
    sheet.current!.addEventListener('touchmove', handleTouchMove);
    sheet.current!.addEventListener('touchend', handleTouchEnd);
  }, []);

  const expandToMax = () => {
    if (sheet.current) {
      sheet.current.style.setProperty('transform', `translateY(400px)`);
    }
  };

  const collapseToMin = () => {
    if (sheet.current) {
      sheet.current.style.setProperty('transform', `translateY(${MAX_Y}px)`);
    }
  };

  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current!.isContentAreaTouched = true;
    };
    content.current!.addEventListener('touchstart', handleTouchStart);
  }, []);

  return { sheet, content, expandToMax, collapseToMin };
}
