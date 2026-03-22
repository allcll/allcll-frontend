import { useEffect, useRef, useState } from 'react';

/** ease-out cubic 이징 함수 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * 숫자 배열을 이전 값에서 목표값으로 부드럽게 애니메이션합니다.
 *
 * - 첫 마운트 시: 0 → targets (0에서 올라오는 애니메이션)
 * - 값 변경 시: 현재 애니메이션 위치 → 새 targets (끊김 없는 전환)
 *
 * @param targets  목표 값 배열
 * @param duration 애니메이션 지속 시간 (ms), 기본값: 500
 */
export function useAnimatedValues(targets: readonly number[], duration = 500): readonly number[] {
  const [displayed, setDisplayed] = useState<number[]>(() => new Array(targets.length).fill(0));
  // RAF 진행 중 현재 위치를 추적 (stale closure 방지)
  const currentRef = useRef<number[]>(new Array(targets.length).fill(0));
  const rafRef = useRef<number>(0);
  // targets 의 직렬화 키 (배열 변경 감지)
  const targetKey = targets.join(',');

  useEffect(() => {
    const startValues = [...currentRef.current];
    // 배열이 늘어난 경우 새 요소는 0에서 시작
    while (startValues.length < targets.length) startValues.push(0);

    const startTime = performance.now();
    cancelAnimationFrame(rafRef.current);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const current = targets.map((target, i) => {
        const start = startValues[i] ?? 0;
        return start + (target - start) * eased;
      });

      currentRef.current = current;
      setDisplayed([...current]);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey, duration]);

  return displayed;
}
