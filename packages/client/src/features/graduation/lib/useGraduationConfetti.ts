import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const COLORS = [
  '#1D4ED8',
  '#3B82F6',
  '#93C5FD',
  '#F59E0B',
  '#FCD34D',
  '#7C3AED',
  '#A78BFA',
  '#FFFFFF',
];

function launchRocket(x: number, burstY: number): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  const STEPS = 14;
  const TRAIL_DURATION = 580;
  const stepInterval = TRAIL_DURATION / STEPS;

  for (let i = 0; i < STEPS; i++) {
    timers.push(setTimeout(() => {
      const y = 1.0 - (1.0 - burstY) * (i / (STEPS - 1));
      confetti({
        particleCount: 8,
        angle: 270,
        spread: 10,
        startVelocity: 10,
        gravity: 0.3,
        decay: 0.86,
        ticks: 45,
        origin: { x, y },
        colors: ['#FFFFFF', '#FCD34D', '#FCA5A5'],
        shapes: ['circle'],
        scalar: 0.65,
      });
    }, i * stepInterval));
  }

  timers.push(setTimeout(() => {
    confetti({
      particleCount: 160,
      spread: 360,
      startVelocity: 35,
      gravity: 0.4,
      decay: 0.92,
      ticks: 200,
      origin: { x, y: burstY },
      colors: COLORS,
      shapes: ['star'],
      scalar: 0.9,
    });
    confetti({
      particleCount: 60,
      spread: 360,
      startVelocity: 12,
      gravity: 0.2,
      decay: 0.97,
      ticks: 250,
      origin: { x, y: burstY },
      colors: ['#FFFFFF', '#FCD34D'],
      shapes: ['circle'],
      scalar: 0.4,
    });
  }, TRAIL_DURATION + 50));

  // 2차 연쇄 폭발
  timers.push(setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 360,
      startVelocity: 22,
      gravity: 0.5,
      decay: 0.91,
      ticks: 160,
      origin: { x, y: burstY },
      colors: COLORS,
      shapes: ['star', 'circle'],
      scalar: 0.7,
    });
  }, TRAIL_DURATION + 320));

  return () => timers.forEach(clearTimeout);
}

function fireGraduation(): () => void {
  const outerTimers: ReturnType<typeof setTimeout>[] = [];
  const innerCleanups: (() => void)[] = [];

  const launches = [
    { x: 0.5,  burstY: 0.2,  delay: 0    },
    { x: 0.2,  burstY: 0.25, delay: 400  },
    { x: 0.8,  burstY: 0.25, delay: 450  },
    { x: 0.35, burstY: 0.15, delay: 900  },
    { x: 0.65, burstY: 0.15, delay: 950  },
    { x: 0.15, burstY: 0.2,  delay: 1500 },
    { x: 0.85, burstY: 0.2,  delay: 1550 },
    { x: 0.5,  burstY: 0.12, delay: 2000 },
  ];

  launches.forEach(({ x, burstY, delay }) => {
    outerTimers.push(setTimeout(() => {
      innerCleanups.push(launchRocket(x, burstY));
    }, delay));
  });

  return () => {
    outerTimers.forEach(clearTimeout);
    innerCleanups.forEach(fn => fn());
    confetti.reset();
  };
}

export function useGraduationConfetti(isGraduatable: boolean) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!isGraduatable || hasFired.current) return;

    let cleanup: (() => void) | null = null;
    const timer = setTimeout(() => {
      hasFired.current = true;
      cleanup = fireGraduation();
    }, 350);
    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [isGraduatable]);
}
