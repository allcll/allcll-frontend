import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const PETAL_PATH = [
  'M 50 6',
  'C 47 2 37 0 26 6',
  'C 8 16 2 42 6 62',
  'C 11 85 32 100 50 100',
  'C 68 100 89 85 94 62',
  'C 98 42 92 16 74 6',
  'C 63 0 53 2 50 6',
  'Z',
].join(' ');

const SPRING_PETAL_COLORS = ['#F8B9C8', '#F9C0CC', '#FAC4D1', '#FCD2DE', '#FDE4EC', '#F6B3C2', '#F5ABBE', '#F39DB2'];

export function useSpringConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const intervalMs = reducedMotion ? 800 : isMobile ? 550 : 380;
    const ticks = isMobile ? 350 : 500;

    const myConfetti = confetti.create(canvas, { resize: true });
    const petal = confetti.shapeFromPath({ path: PETAL_PATH });

    const interval = setInterval(() => {
      if (document.hidden || !isVisible.current) return;

      const count = !isMobile && !reducedMotion && Math.random() < 0.3 ? 2 : 1; // NOSONAR

      myConfetti({
        shapes: [petal],
        colors: SPRING_PETAL_COLORS,
        particleCount: count,
        angle: 268 + Math.random() * 10, // NOSONAR
        spread: 12 + Math.random() * 18, // NOSONAR
        startVelocity: 2 + Math.random() * 1.5, // NOSONAR
        gravity: 0.18,
        decay: 0.993,
        ticks,
        scalar: 1.6,
        origin: { x: Math.random(), y: 0 }, // NOSONAR
      });
    }, intervalMs);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        myConfetti.reset();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          myConfetti.reset();
        }
      },
      { threshold: 0 },
    );

    document.addEventListener('visibilitychange', handleVisibilityChange);
    observer.observe(canvas);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      myConfetti.reset();
    };
  }, [canvasRef]);
}
