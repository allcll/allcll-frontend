import { memo, useMemo, useCallback, useState, useRef, useLayoutEffect, useEffect } from 'react';
import { toRad } from './internal/geometry';
import { useAnimatedValues } from './internal/useAnimatedValues';
import { ChartTooltip, SimpleTooltipState } from './internal/ChartTooltip';
import { ChartLegend, LegendItem } from './internal/ChartLegend';

// ---------------------------------------------------------------------------
// 레이아웃 상수 — 수정하려면 이 값들을 조정하세요
// ---------------------------------------------------------------------------
/** SVG 뷰포트 크기 (px). 실제 크기는 부모 CSS 로 제어합니다. */
const VIEWBOX_SIZE = 400;
/** 차트 반지름 (px). 레이블 공간(~24px)을 포함해 뷰포트 안에 수용됩니다. */
const RADAR_RADIUS = 140;
/** 격자 동심 다각형 개수 */
const GRID_LEVELS = 5;
/** 데이터 포인트 원의 반지름 (px) */
const POINT_RADIUS = 4;

const CX = VIEWBOX_SIZE / 2;
const CY = VIEWBOX_SIZE / 2;

// ---------------------------------------------------------------------------
// 공개 타입
// ---------------------------------------------------------------------------

export interface RadarDataset {
  label: string;
  data: number[];
  /** 반투명 채우기 색상 (예: 'rgba(0,122,255,0.2)') */
  backgroundColor: string;
  /** 외곽선 색상 */
  borderColor: string;
  borderWidth: number;
  /** 데이터 포인트 원 색상 */
  pointBackgroundColor: string;
}

export interface RadarChartData {
  /** 각 축의 레이블. 위에서 시작해 시계 방향으로 배치됩니다. */
  labels: string[];
  datasets: RadarDataset[];
}

export interface RadarChartOptions {
  responsive?: boolean;
  scales?: {
    r?: {
      /** false 이면 각 축의 기준선을 숨깁니다 */
      angleLines?: { display?: boolean };
      /** Y축 최솟값 (기본값: 0) */
      suggestedMin?: number;
      /** Y축 최댓값 (기본값: 100) */
      suggestedMax?: number;
      ticks?: { display?: boolean };
      pointLabels?: {
        font?: { size?: number };
        color?: string;
      };
      /** 격자 선 색상 */
      grid?: { color?: string };
    };
  };
  plugins?: {
    legend?: {
      /** false 로 지정하면 하단 범례를 숨깁니다 */
      display?: boolean;
      /**
       * true 이면 범례 항목 클릭 시 해당 데이터셋을 숨깁니다.
       * 숨겨진 데이터셋은 취소선 범례 + 불투명도 0 으로 표시됩니다.
       */
      toggleable?: boolean;
    };
    /** false 로 지정하면 마우스오버 툴팁을 비활성화합니다 */
    tooltip?: { enabled?: boolean };
  };
}

interface RadarChartProps {
  data: RadarChartData;
  options?: RadarChartOptions;
  className?: string;
}

// ---------------------------------------------------------------------------
// 내부 헬퍼 타입
// ---------------------------------------------------------------------------

interface RadarPoint {
  x: number;
  y: number;
}

interface ComputedRadarGrid {
  /** 격자 다각형 points 문자열 (GRID_LEVELS 개) */
  gridPolygons: string[];
  /** 레이블 텍스트 위치 좌표 */
  labelCoords: RadarPoint[];
  /** 각 축의 끝 좌표 (angleLines 에 사용) */
  axisEndCoords: RadarPoint[];
}

// ---------------------------------------------------------------------------
// 컴포넌트
// ---------------------------------------------------------------------------

/**
 * 레이더(Spider/Web) 차트.
 *
 * 가장 자주 바꾸는 설정:
 * - 축 범위: `options.scales.r.suggestedMin` / `suggestedMax`
 * - 격자 색상: `options.scales.r.grid.color`
 * - 범례: `options.plugins.legend.display`
 * - 범례 클릭 토글: `options.plugins.legend.toggleable`
 *
 * 크기 동작:
 * - 부모에 명시적 height 가 있고 width > height 인 경우: SVG 를 min(width, height) 의 정사각형으로 제한합니다.
 * - 부모에 height 가 없는 경우: SVG 는 width = 100%, height = auto (종횡비 유지)
 *
 * 애니메이션:
 * - 마운트 시: 각 데이터셋 폴리곤이 중심(0)에서 바깥쪽으로 성장합니다.
 * - 값 변경 시: 이전 위치에서 새 위치로 끊김 없이 전환됩니다.
 */
export const RadarChart = memo(function RadarChart({ data, options, className }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<SimpleTooltipState | null>(null);
  // 범례 토글: 숨겨진 데이터셋 인덱스 집합
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());

  const { labels, datasets } = data;
  const n = labels.length;

  const suggestedMin = options?.scales?.r?.suggestedMin ?? 0;
  const suggestedMax = options?.scales?.r?.suggestedMax ?? 100;
  const range = suggestedMax - suggestedMin;

  const showLegend = options?.plugins?.legend?.display !== false;
  const legendToggleable = options?.plugins?.legend?.toggleable ?? false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const pointLabelColor = options?.scales?.r?.pointLabels?.color ?? '#374151';
  const pointLabelFontSize = options?.scales?.r?.pointLabels?.font?.size ?? 12;
  const gridColor = options?.scales?.r?.grid?.color ?? '#E5E7EB';
  const showAngleLines = options?.scales?.r?.angleLines?.display !== false;

  // -----------------------------------------------------------------------
  // 크기 제약: width > parentHeight 일 때 SVG 를 min(width, parentHeight) 로 제한
  // -----------------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgSize, setSvgSize] = useState<number | undefined>(undefined);

  const updateSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const elWidth = el.offsetWidth;
    const parentHeight = el.parentElement?.offsetHeight ?? 0;
    // 부모에 명시적 height 가 있고 SVG 가 그것을 초과할 경우에만 제한
    if (parentHeight > 0 && parentHeight < elWidth) {
      setSvgSize(parentHeight);
    } else {
      setSvgSize(undefined);
    }
  }, []);

  // 첫 렌더링에서 flash 없이 크기를 잡으려면 useLayoutEffect 사용
  useLayoutEffect(() => {
    updateSize();
  }, [updateSize]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [updateSize]);

  // -----------------------------------------------------------------------
  // 각도 → 좌표 변환 유틸리티
  // -----------------------------------------------------------------------
  const angleForIndex = useCallback((i: number) => toRad((360 / n) * i) - Math.PI / 2, [n]);

  const valueToCoord = useCallback(
    (value: number, i: number): RadarPoint => {
      const angle = angleForIndex(i);
      const normalized = range > 0 ? (value - suggestedMin) / range : 0;
      const dist = Math.min(Math.max(normalized, 0), 1) * RADAR_RADIUS;
      return { x: CX + dist * Math.cos(angle), y: CY + dist * Math.sin(angle) };
    },
    [angleForIndex, range, suggestedMin],
  );

  // -----------------------------------------------------------------------
  // 격자 / 레이블 / 축 계산 (애니메이션 불필요)
  // -----------------------------------------------------------------------
  const grid = useMemo<ComputedRadarGrid>(() => {
    const gridPolygons = Array.from({ length: GRID_LEVELS }, (_, level) => {
      const fr = (RADAR_RADIUS * (level + 1)) / GRID_LEVELS;
      return Array.from({ length: n }, (_, i) => {
        const angle = angleForIndex(i);
        return `${CX + fr * Math.cos(angle)},${CY + fr * Math.sin(angle)}`;
      }).join(' ');
    });
    const axisEndCoords = Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i);
      return { x: CX + RADAR_RADIUS * Math.cos(angle), y: CY + RADAR_RADIUS * Math.sin(angle) };
    });
    const labelCoords = Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i);
      const labelR = RADAR_RADIUS + 24;
      return { x: CX + labelR * Math.cos(angle), y: CY + labelR * Math.sin(angle) };
    });
    return { gridPolygons, axisEndCoords, labelCoords };
  }, [n, angleForIndex]);

  // -----------------------------------------------------------------------
  // 데이터 값 애니메이션: 0 → target (마운트), prev → new (업데이트)
  // 모든 데이터셋의 값을 하나의 flat 배열로 관리합니다.
  // -----------------------------------------------------------------------
  const targetValues = useMemo<number[]>(
    () => datasets.flatMap((ds, di) => (hiddenIndices.has(di) ? ds.data.map(() => 0) : ds.data)),
    [datasets, hiddenIndices],
  );
  const animatedValues = useAnimatedValues(targetValues);

  // flat 배열을 datasets 별로 재구성
  const getAnimatedDataForDs = useCallback(
    (dsIdx: number): number[] => {
      const start = dsIdx * n;
      return Array.from({ length: n }, (_, i) => animatedValues[start + i] ?? 0);
    },
    [animatedValues, n],
  );

  // -----------------------------------------------------------------------
  // 범례 항목
  // -----------------------------------------------------------------------
  const legendItems = useMemo<LegendItem[]>(
    () => datasets.map(ds => ({ label: ds.label, color: ds.borderColor })),
    [datasets],
  );

  const hideTooltip = useCallback(() => setTooltip(null), []);

  const handleLegendToggle = useCallback((index: number) => {
    setHiddenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  // SVG 크기 스타일
  const svgStyle: React.CSSProperties =
    svgSize !== undefined
      ? { display: 'block', margin: '0 auto', width: svgSize, height: svgSize }
      : { display: 'block', width: '100%', height: 'auto' };

  return (
    <div ref={containerRef} className={className}>
      <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} style={svgStyle} role="img" aria-label="레이더 차트">
        {/* 격자 다각형 */}
        {grid.gridPolygons.map((pts, level) => (
          <polygon key={level} points={pts} fill="none" stroke={gridColor} strokeWidth={1} />
        ))}

        {/* 각 축 기준선 */}
        {showAngleLines &&
          grid.axisEndCoords.map((end, i) => (
            <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke={gridColor} strokeWidth={1} />
          ))}

        {/* 데이터셋별 다각형 + 포인트 (애니메이션 값 사용) */}
        {datasets.map((ds, di) => {
          const hidden = hiddenIndices.has(di);
          const animData = getAnimatedDataForDs(di);
          const pointCoords = animData.map((v, i) => valueToCoord(v, i));
          const polygonPoints = pointCoords.map(pt => `${pt.x},${pt.y}`).join(' ');

          return (
            <g key={di} opacity={hidden ? 0 : 1} style={{ transition: 'opacity 0.2s' }}>
              <polygon
                points={polygonPoints}
                fill={ds.backgroundColor}
                stroke={ds.borderColor}
                strokeWidth={ds.borderWidth}
              />
              {pointCoords.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={POINT_RADIUS}
                  fill={ds.pointBackgroundColor}
                  style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                  onMouseEnter={e => {
                    if (showTooltip)
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        label: `${ds.label}: ${labels[i]}`,
                        value: ds.data[i] ?? 0,
                      });
                  }}
                  onMouseMove={e => setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null))}
                  onMouseLeave={hideTooltip}
                />
              ))}
            </g>
          );
        })}

        {/* 축 레이블 */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={grid.labelCoords[i]?.x}
            y={grid.labelCoords[i]?.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={pointLabelFontSize}
            fill={pointLabelColor}
          >
            {label}
          </text>
        ))}
      </svg>

      {showTooltip && tooltip && <ChartTooltip state={tooltip} />}
      {showLegend && (
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
