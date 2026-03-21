import { memo, useMemo, useCallback, useState } from 'react';
import { getSliceColor } from './internal/color';
import { arcPath } from './internal/geometry';
import { ChartTooltip, SimpleTooltipState } from './internal/ChartTooltip';
import { ChartLegend, LegendItem } from './internal/ChartLegend';

// ---------------------------------------------------------------------------
// 레이아웃 상수 — 수정하려면 이 값들을 조정하세요
// ---------------------------------------------------------------------------
/** SVG 뷰포트 크기 (px). 실제 렌더 크기는 부모의 CSS가 결정합니다. */
const VIEWBOX_SIZE = 200;
/** 차트 가장자리와 SVG 테두리 사이의 여백 (px) */
const CHART_PADDING = 4;
/** 슬라이스별 페이드인 간격 (초) */
const ANIM_STAGGER_S = 0.08;
/** 페이드인 재생 시간 (초) */
const ANIM_DUR_S = 0.4;

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
 * 마운트 시 각 슬라이스가 순서대로 페이드인합니다.
 */
export const DoughnutChart = memo(function DoughnutChart({ data, options, className }: DoughnutChartProps) {
  const [tooltip, setTooltip] = useState<SimpleTooltipState | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // 범례 토글: 숨겨진 슬라이스 인덱스 집합
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());

  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const legendToggleable = options?.plugins?.legend?.toggleable ?? false;

  // 슬라이스 arc path 는 data 가 바뀔 때만 재계산
  // 숨겨진 슬라이스는 data를 0으로 처리해 공간을 제거합니다
  const arcs = useMemo<ArcSlice[]>(() => {
    const dataset = data.datasets[0];
    if (!dataset) return [];

    const cutoutPercent = parseFloat(dataset.cutout ?? '50') / 100;
    const innerRadius = OUTER_RADIUS * cutoutPercent;
    const values = dataset.data.map((v, i) => (hiddenIndices.has(i) ? 0 : v));
    const total = values.reduce((sum, v) => sum + v, 0);
    let currentAngle = -Math.PI / 2;

    return values.map((value, i) => {
      const sweepAngle = total > 0 ? (value / total) * 2 * Math.PI : 0;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sweepAngle;
      currentAngle = endAngle;
      return {
        path: sweepAngle > 0 ? arcPath(CX, CY, OUTER_RADIUS, innerRadius, startAngle, endAngle) : '',
        value: dataset.data[i] ?? 0,
        i,
        color: getSliceColor(dataset.backgroundColor, i),
      };
    });
  }, [data.datasets, hiddenIndices]);

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
  if (!data.datasets[0]) return null;

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
              strokeWidth={data.datasets[0]?.borderWidth ?? 2}
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
            >
              {/* 슬라이스 페이드인 애니메이션 */}
              <animate
                attributeName="opacity"
                from="0"
                to={dimmed ? '0.7' : '1'}
                dur={`${ANIM_DUR_S}s`}
                begin={`${arc.i * ANIM_STAGGER_S}s`}
                fill="freeze"
              />
            </path>
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
