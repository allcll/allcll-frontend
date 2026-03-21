import { memo, useMemo, useCallback, useState } from 'react';
import { toRad } from './internal/geometry';
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
    /** false 로 지정하면 하단 범례를 숨깁니다 */
    legend?: { display?: boolean };
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

interface ComputedRadarData {
  /** 각 데이터셋의 다각형 폴리곤 points 문자열 */
  polygons: string[];
  /** 각 데이터셋의 개별 포인트 좌표 */
  pointCoords: RadarPoint[][];
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
 */
export const RadarChart = memo(function RadarChart({ data, options, className }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<SimpleTooltipState | null>(null);

  const { labels, datasets } = data;
  const n = labels.length;

  const suggestedMin = options?.scales?.r?.suggestedMin ?? 0;
  const suggestedMax = options?.scales?.r?.suggestedMax ?? 100;
  const range = suggestedMax - suggestedMin;

  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const pointLabelColor = options?.scales?.r?.pointLabels?.color ?? '#374151';
  const pointLabelFontSize = options?.scales?.r?.pointLabels?.font?.size ?? 12;
  const gridColor = options?.scales?.r?.grid?.color ?? '#E5E7EB';
  const showAngleLines = options?.scales?.r?.angleLines?.display !== false;

  // 각도 → 좌표 변환 유틸리티
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

  // SVG 좌표 계산은 labels / datasets / 옵션이 바뀔 때만 재계산
  const computed = useMemo<ComputedRadarData>(() => {
    // 격자 다각형
    const gridPolygons = Array.from({ length: GRID_LEVELS }, (_, level) => {
      const fr = (RADAR_RADIUS * (level + 1)) / GRID_LEVELS;
      return Array.from({ length: n }, (_, i) => {
        const angle = angleForIndex(i);
        return `${CX + fr * Math.cos(angle)},${CY + fr * Math.sin(angle)}`;
      }).join(' ');
    });

    // 축 끝점
    const axisEndCoords = Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i);
      return { x: CX + RADAR_RADIUS * Math.cos(angle), y: CY + RADAR_RADIUS * Math.sin(angle) };
    });

    // 레이블 위치
    const labelCoords = Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i);
      const labelR = RADAR_RADIUS + 24;
      return { x: CX + labelR * Math.cos(angle), y: CY + labelR * Math.sin(angle) };
    });

    // 데이터셋별 다각형 & 포인트 좌표
    const polygons = datasets.map(ds =>
      ds.data
        .map((v, i) => {
          const { x, y } = valueToCoord(v, i);
          return `${x},${y}`;
        })
        .join(' '),
    );

    const pointCoords = datasets.map(ds => ds.data.map((v, i) => valueToCoord(v, i)));

    return { gridPolygons, axisEndCoords, labelCoords, polygons, pointCoords };
  }, [labels, datasets, angleForIndex, valueToCoord, n]);

  // 범례 항목
  const legendItems = useMemo<LegendItem[]>(
    () => datasets.map(ds => ({ label: ds.label, color: ds.borderColor })),
    [datasets],
  );

  const hideTooltip = useCallback(() => setTooltip(null), []);

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} width="100%" height="100%">
        {/* 격자 다각형 */}
        {computed.gridPolygons.map((pts, level) => (
          <polygon key={level} points={pts} fill="none" stroke={gridColor} strokeWidth={1} />
        ))}

        {/* 각 축 기준선 */}
        {showAngleLines &&
          computed.axisEndCoords.map((end, i) => (
            <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke={gridColor} strokeWidth={1} />
          ))}

        {/* 데이터셋별 다각형 + 포인트 */}
        {datasets.map((ds, di) => (
          <g key={di}>
            <polygon
              points={computed.polygons[di]}
              fill={ds.backgroundColor}
              stroke={ds.borderColor}
              strokeWidth={ds.borderWidth}
            />
            {computed.pointCoords[di]?.map((pt, i) => (
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
        ))}

        {/* 축 레이블 */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={computed.labelCoords[i]?.x}
            y={computed.labelCoords[i]?.y}
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
      {showLegend && <ChartLegend items={legendItems} />}
    </div>
  );
});
