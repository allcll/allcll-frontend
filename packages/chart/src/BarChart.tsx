import { memo, useMemo, useCallback, useState } from 'react';
import { getSliceColor } from './internal/color';
import { useAnimatedValues } from './internal/useAnimatedValues';
import { ChartTooltip, SimpleTooltipState } from './internal/ChartTooltip';

// ---------------------------------------------------------------------------
// 레이아웃 상수 — 수정하려면 이 값들을 조정하세요
// ---------------------------------------------------------------------------
/** SVG 뷰포트 전체 너비 (px) */
const VIEW_WIDTH = 300;
/** SVG 뷰포트 전체 높이 (px) */
const VIEW_HEIGHT = 220;
const PAD_TOP = 10;
const PAD_RIGHT = 10;
const PAD_BOTTOM = 40;
const PAD_LEFT = 30;

/** 막대 한 개의 최대 너비 (px). 항목이 적을수록 막대가 이 값 이하로 넓어집니다. */
const MAX_BAR_WIDTH = 40;
/** Y축 격자선 개수 */
const Y_TICK_COUNT = 4;

// ---------------------------------------------------------------------------
// 공개 타입
// ---------------------------------------------------------------------------

export interface BarDataset {
  data: number[];
  /**
   * 막대 색상. 단일 문자열이면 모든 막대에 동일하게 적용되고,
   * 배열이면 인덱스에 맞는 색상이 적용됩니다.
   */
  backgroundColor: string | string[];
  label?: string;
}

export interface BarChartData {
  /** x축 레이블 목록. datasets[0].data 와 길이가 같아야 합니다. */
  labels: string[];
  datasets: BarDataset[];
}

interface BarChartProps {
  data: BarChartData;
  className?: string;
}

// ---------------------------------------------------------------------------
// 내부 헬퍼 타입
// ---------------------------------------------------------------------------

interface BarSlot {
  value: number;
  label: string;
  color: string;
  /** 막대 왼쪽 x 좌표 */
  x: number;
  /** 완전히 채워졌을 때의 막대 너비 */
  width: number;
  /** yMax 기준 막대의 비율 (0~1) */
  ratio: number;
}

// ---------------------------------------------------------------------------
// 컴포넌트
// ---------------------------------------------------------------------------

/**
 * 단순 수직 막대 차트.
 *
 * 가장 자주 바꾸는 설정:
 * - 색상: `data.datasets[0].backgroundColor`
 * - 레이블: `data.labels`
 *
 * 애니메이션:
 * - 마운트 시: 각 막대가 0에서 목표 높이까지 자랍니다.
 * - 값 변경 시: 이전 높이에서 새 높이로 끊김 없이 전환됩니다.
 */
export const BarChart = memo(function BarChart({ data, className }: BarChartProps) {
  const [tooltip, setTooltip] = useState<SimpleTooltipState | null>(null);

  const chartWidth = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
  const chartHeight = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;

  // -----------------------------------------------------------------------
  // 막대 레이아웃 + 목표 비율 계산
  // -----------------------------------------------------------------------
  const { slots, yMax, yTicks } = useMemo(() => {
    const dataset = data.datasets[0];
    if (!dataset) return { slots: [], yMax: 0, yTicks: [] };

    const values = dataset.data;
    const max = Math.max(...values, 0);
    const slotWidth = chartWidth / Math.max(values.length, 1);
    const barWidth = Math.min(slotWidth * 0.6, MAX_BAR_WIDTH);

    const barSlots: BarSlot[] = values.map((value, i) => ({
      value,
      label: data.labels[i] ?? '',
      color: getSliceColor(dataset.backgroundColor, i),
      x: i * slotWidth + (slotWidth - barWidth) / 2,
      width: barWidth,
      ratio: max > 0 ? value / max : 0,
    }));

    const ticks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, i) => (max * i) / Y_TICK_COUNT);
    return { slots: barSlots, yMax: max, yTicks: ticks };
  }, [data.datasets, data.labels, chartWidth, chartHeight]);

  // -----------------------------------------------------------------------
  // 막대 비율 애니메이션: 0 → target (마운트), prev → new (업데이트)
  // -----------------------------------------------------------------------
  const targetRatios = useMemo(() => slots.map(s => s.ratio), [slots]);
  const animatedRatios = useAnimatedValues(targetRatios);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  // 데이터가 없으면 렌더링하지 않음
  if (!data.datasets[0]) return null;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="막대 차트"
      >
        <g transform={`translate(${PAD_LEFT}, ${PAD_TOP})`}>
          {/* Y축 격자선 + 눈금 레이블 */}
          {yTicks.map((tickVal, i) => {
            const yPos = chartHeight - (yMax > 0 ? (tickVal / yMax) * chartHeight : 0);
            return (
              <g key={i}>
                <line x1={0} y1={yPos} x2={chartWidth} y2={yPos} stroke="#e5e7eb" strokeWidth={1} />
                <text x={-4} y={yPos + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                  {Math.round(tickVal)}
                </text>
              </g>
            );
          })}

          {/* X축 */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#d1d5db" strokeWidth={1} />

          {/* 막대 + x 레이블: 애니메이션 비율로 높이/y 계산 */}
          {slots.map((slot, i) => {
            const ratio = animatedRatios[i] ?? 0;
            const barHeight = ratio * chartHeight;
            const barY = chartHeight - barHeight;
            return (
              <g key={i}>
                <rect
                  x={slot.x}
                  y={barY}
                  width={slot.width}
                  height={Math.max(barHeight, 0)}
                  fill={slot.color}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => setTooltip({ x: e.clientX, y: e.clientY, label: slot.label, value: slot.value })}
                  onMouseMove={e => setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))}
                  onMouseLeave={hideTooltip}
                />
                <text x={slot.x + slot.width / 2} y={chartHeight + 16} textAnchor="middle" fontSize={10} fill="#6b7280">
                  {slot.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {tooltip && <ChartTooltip state={tooltip} />}
    </div>
  );
});
