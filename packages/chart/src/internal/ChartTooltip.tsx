import type { CSSProperties } from 'react';

/** 툴팁 공통 스타일. Tailwind className 이 없는 환경에서도 검은 배경이 보장됩니다. */
const TOOLTIP_STYLE: CSSProperties = {
  backgroundColor: '#1f2937', // gray-800
  color: '#ffffff',
  fontSize: '0.75rem',
  borderRadius: '0.25rem',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  pointerEvents: 'none',
  position: 'fixed',
  zIndex: 1000,
};

// ---------------------------------------------------------------------------
// 단일 항목 툴팁 (BarChart, DoughnutChart, RadarChart 공용)
// ---------------------------------------------------------------------------

/**
 * 단일 항목 차트 툴팁 컴포넌트.
 * position: fixed 로 마우스 커서 옆에 표시됩니다.
 */
export interface SimpleTooltipState {
  /** 마우스 절대 x 좌표 (clientX) */
  x: number;
  /** 마우스 절대 y 좌표 (clientY) */
  y: number;
  /** 툴팁에 표시할 항목 레이블 */
  label: string;
  /** 툴팁에 표시할 값 */
  value: number;
}

interface ChartTooltipProps {
  state: SimpleTooltipState;
}

export function ChartTooltip({ state }: ChartTooltipProps) {
  return (
    <div
      role="tooltip"
      aria-live="polite"
      style={{ ...TOOLTIP_STYLE, left: state.x + 12, top: state.y - 28, padding: '2px 8px' }}
    >
      {state.label}: {state.value}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MixedChart 전용 다중 항목 툴팁
// ---------------------------------------------------------------------------

/** 다중 항목 툴팁의 단일 행 */
export interface MultiTooltipItem {
  label: string;
  value: number;
  /** CSS 색상 문자열 (범례 색상 점에 사용) */
  color: string;
}

export interface MultiTooltipState {
  x: number;
  y: number;
  /** 툴팁 헤더에 표시되는 x축 레이블 */
  title: string;
  items: MultiTooltipItem[];
}

interface MultiChartTooltipProps {
  state: MultiTooltipState;
  /** 각 행의 문자열을 커스터마이징하는 포맷 함수 */
  formatLabel: (label: string, value: number) => string;
}

export function MultiChartTooltip({ state, formatLabel }: MultiChartTooltipProps) {
  return (
    <div
      role="tooltip"
      aria-live="polite"
      style={{ ...TOOLTIP_STYLE, left: state.x + 14, top: state.y - 10, padding: '6px 12px', minWidth: 'max-content' }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{state.title}</div>
      {state.items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              backgroundColor: item.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span>{formatLabel(item.label, item.value)}</span>
        </div>
      ))}
    </div>
  );
}
