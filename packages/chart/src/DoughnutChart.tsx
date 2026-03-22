import { memo, useMemo, useCallback, useState } from 'react';
import { getSliceColor } from './internal/color';
import { arcPath } from './internal/geometry';
import { useAnimatedValues } from './internal/useAnimatedValues';
import { ChartTooltip, SimpleTooltipState } from './internal/ChartTooltip';
import { ChartLegend, LegendItem } from './internal/ChartLegend';

// ---------------------------------------------------------------------------
// 레이아웃 상수 — 수정하려면 이 값들을 조정하세요
// ---------------------------------------------------------------------------
/** SVG 뷰포트 크기 (px). 실제 렌더 크기는 부모의 CSS가 결정합니다. */
const VIEWBOX_SIZE = 200;
/** 차트 가장자리와 SVG 테두리 사이의 여백 (px) */
const CHART_PADDING = 4;
/** 이 값보다 작은 sweepAngle 은 렌더링하지 않습니다 (SVG arcPath 오류 방지) */
const MIN_RENDER_ANGLE = 0.001;

const CX = VIEWBOX_SIZE / 2;
const CY = VIEWBOX_SIZE / 2;
const OUTER_RADIUS = VIEWBOX_SIZE / 2 - CHART_PADDING;

// ---------------------------------------------------------------------------
// 공개 타입 (index.ts 에서 re-export)
// ---------------------------------------------------------------------------

export interface DoughnutDataset {
  data: number[];
  backgroundColor?: string | string[];
  /** 슬라이스 경계선 두께 (기본값: 2) */
  borderWidth?: number;
  /**
   * 도넛 구멍 크기. '50%' 처럼 퍼센트 문자열로 지정합니다.
   * '0%' 이면 파이 차트가 됩니다. (기본값: '50%')
   */
  cutout?: string;
}

export interface DoughnutChartData {
  /** x축 레이블 겸 범례에 표시되는 이름 */
  labels?: string[];
  datasets: DoughnutDataset[];
}

export interface DoughnutChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      /** false 로 지정하면 하단 범례를 숨깁니다 */
      display?: boolean;
      /**
       * true 이면 범례 항목 클릭 시 해당 슬라이스를 숨깁니다.
       * 숨겨진 슬라이스는 취소선 범례 + 불투명도 0 으로 표시됩니다.
       */
      toggleable?: boolean;
    };
    /** false 로 지정하면 마우스오버 툴팁을 비활성화합니다 */
    tooltip?: { enabled?: boolean };
  };
}

interface DoughnutChartProps {
  data: DoughnutChartData;
  options?: DoughnutChartOptions;
  className?: string;
}

// ---------------------------------------------------------------------------
// 내부 헬퍼 타입
// ---------------------------------------------------------------------------

interface ArcSlice {
  path: string;
  value: number;
  i: number;
  color: string;
}

// ---------------------------------------------------------------------------
// 컴포넌트
// ---------------------------------------------------------------------------

/**
 * 도넛(또는 파이) 차트.
 *
 * 가장 자주 바꾸는 설정:
 * - 색상: `data.datasets[0].backgroundColor` 배열
 * - 구멍 크기: `data.datasets[0].cutout` (예: '75%')
 * - 범례 표시: `options.plugins.legend.display`
 * - 범례 클릭 토글: `options.plugins.legend.toggleable`
 *
 * 애니메이션:
 * - 마운트 시: 각 슬라이스가 0에서 목표 각도까지 시계방향으로 채워집니다.
 * - 값 변경 시: 이전 각도에서 새 각도로 끊김 없이 전환됩니다.
 */
export const DoughnutChart = memo(function DoughnutChart({ data, options, className }: DoughnutChartProps) {
  const [tooltip, setTooltip] = useState<SimpleTooltipState | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // 범례 토글: 숨겨진 슬라이스 인덱스 집합
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());

  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const legendToggleable = options?.plugins?.legend?.toggleable ?? false;

  const dataset = data.datasets[0];

  // -----------------------------------------------------------------------
  // 목표 sweepAngle 계산 (숨겨진 슬라이스는 0)
  // -----------------------------------------------------------------------
  const targetSweepAngles = useMemo<number[]>(() => {
    if (!dataset) return [];
    const values = dataset.data.map((v, i) => (hiddenIndices.has(i) ? 0 : v));
    const total = values.reduce((sum, v) => sum + v, 0);
    return values.map(v => (total > 0 ? (v / total) * 2 * Math.PI : 0));
  }, [dataset, hiddenIndices]);

  // -----------------------------------------------------------------------
  // sweepAngle 애니메이션: 0 → target (마운트), prev → new (업데이트)
  // -----------------------------------------------------------------------
  const animatedSweepAngles = useAnimatedValues(targetSweepAngles);

  // -----------------------------------------------------------------------
  // 애니메이션 값으로 arc path 계산
  // -----------------------------------------------------------------------
  const arcs = useMemo<ArcSlice[]>(() => {
    if (!dataset) return [];
    const cutoutPercent = parseFloat(dataset.cutout ?? '50') / 100;
    const innerRadius = OUTER_RADIUS * cutoutPercent;
    let currentAngle = -Math.PI / 2;

    return animatedSweepAngles.map((sweepAngle, i) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweepAngle;
      currentAngle = endAngle;
      return {
        // 매우 작은 각도는 렌더링하지 않음 (SVG path 오류 방지)
        path: sweepAngle > MIN_RENDER_ANGLE ? arcPath(CX, CY, OUTER_RADIUS, innerRadius, startAngle, endAngle) : '',
        value: dataset.data[i] ?? 0,
        i,
        color: getSliceColor(dataset.backgroundColor, i),
      };
    });
  }, [dataset, animatedSweepAngles]);

  // 범례 항목도 data 가 바뀔 때만 재계산
  const legendItems = useMemo<LegendItem[]>(
    () =>
      (data.labels ?? []).map((label, i) => ({
        label,
        color: getSliceColor(data.datasets[0]?.backgroundColor, i),
      })),
    [data.labels, data.datasets],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  const handleLegendToggle = useCallback((index: number) => {
    setHiddenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  // 데이터가 없으면 렌더링하지 않음
  if (!dataset) return null;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label="도넛 차트"
      >
        {arcs.map(arc => {
          if (arc.path === '') return null;
          const dimmed = hoveredIndex !== null && hoveredIndex !== arc.i;
          return (
            <path
              key={arc.i}
              d={arc.path}
              fill={arc.color}
              stroke="white"
              strokeWidth={dataset.borderWidth ?? 2}
              opacity={dimmed ? 0.7 : 1}
              style={{ cursor: showTooltip ? 'pointer' : 'default', transition: 'opacity 0.15s' }}
              onMouseEnter={e => {
                setHoveredIndex(arc.i);
                if (showTooltip) {
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    label: data.labels?.[arc.i] ?? `항목 ${arc.i + 1}`,
                    value: arc.value,
                  });
                }
              }}
              onMouseMove={e => {
                if (showTooltip) {
                  setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                }
              }}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>

      {showTooltip && tooltip && <ChartTooltip state={tooltip} />}
      {showLegend && legendItems.length > 0 && (
        <ChartLegend
          items={legendItems}
          toggleable={legendToggleable}
          hiddenIndices={hiddenIndices}
          onToggle={handleLegendToggle}
        />
      )}
    </div>
  );
});
