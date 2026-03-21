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
      style={{ position: 'fixed', left: state.x + 12, top: state.y - 28, zIndex: 1000, pointerEvents: 'none' }}
      className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow"
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
      style={{ position: 'fixed', left: state.x + 14, top: state.y - 10, zIndex: 1000, pointerEvents: 'none' }}
      className="bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg min-w-max"
    >
      <div className="font-semibold mb-1">{state.title}</div>
      {state.items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
          <span>{formatLabel(item.label, item.value)}</span>
        </div>
      ))}
    </div>
  );
}
