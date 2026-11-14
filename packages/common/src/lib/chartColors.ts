import { type RefObject, useCallback, useSyncExternalStore } from 'react';

export interface ChartColors {
  text: string;
  grid: string;
  track: string;
  surface: string;
}

// FIXME: Chart.js가 oklch를 못 읽어 theme.css 값을 hex로 복사, theme.css 변경 시 함께 수정 필요
const LIGHT_CHART_COLORS: ChartColors = {
  text: '#6a7282',
  grid: '#e5e7eb',
  track: '#e5e7eb',
  surface: '#ffffff',
};

const DARK_CHART_COLORS: ChartColors = {
  text: '#828893',
  grid: '#30353e',
  track: '#30353e',
  surface: '#181b21',
};

function subscribeRootClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function useChartColors(containerRef: RefObject<HTMLElement | null>): ChartColors {
  const getIsDark = useCallback(
    () => document.documentElement.classList.contains('dark') && !containerRef.current?.closest('.light'),
    [containerRef],
  );
  const isDark = useSyncExternalStore(subscribeRootClass, getIsDark);

  return isDark ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
}
