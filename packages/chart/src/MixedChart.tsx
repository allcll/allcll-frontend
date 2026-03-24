import { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useAnimatedValues } from './internal/useAnimatedValues';
import { ChartLegend, LegendItem } from './internal/ChartLegend';
import { MultiChartTooltip, MultiTooltipItem, MultiTooltipState } from './internal/ChartTooltip';

// ---------------------------------------------------------------------------
// 레이아웃 상수 — 수정하려면 이 값들을 조정하세요
// ---------------------------------------------------------------------------
/** SVG 전체 높이 (px). 너비는 데이터 개수 + 컨테이너 너비에 따라 자동 조정됩니다. */
const CHART_HEIGHT = 320;
const PAD_TOP = 16;
const PAD_BOTTOM = 56;
const PAD_LEFT = 56;
const PAD_RIGHT = 16;
/** Y축 눈금 개수 */
const Y_TICK_COUNT = 5;
/** 막대 슬롯의 최소 너비(px). 데이터가 적어도 이 너비 이상은 확보됩니다. */
const MIN_BAR_SLOT = 40;

// ---------------------------------------------------------------------------
// 공개 타입
// ---------------------------------------------------------------------------

type MixedDatasetType = 'bar' | 'line';

export interface MixedDataset {
  type: MixedDatasetType;
  label: string;
  data: number[];
  // — 막대 옵션 —
  /** 막대 너비 (px). 기본값: 16 */
  barThickness?: number;
  backgroundColor?: string;
  /** 같은 stack 문자열을 가진 막대끼리 쌓입니다 */
  stack?: string;
  // — 꺾은선 옵션 —
  borderColor?: string;
  /** 선 두께 (px). 기본값: 2 */
  borderWidth?: number;
  /** 데이터 포인트 반지름 (px). 기본값: 4 */
  pointRadius?: number;
  pointBackgroundColor?: string;
  fill?: boolean;
  /**
   * 선의 곡률 (0 = 직선, 0~1 = Catmull-Rom 근사).
   * 기본값: 0
   */
  tension?: number;
}

export interface MixedChartData {
  /** x축 레이블 목록 */
  labels: string[];
  datasets: MixedDataset[];
}

export interface MixedChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
      /**
       * true 이면 범례 항목 클릭 시 해당 데이터셋을 숨깁니다.
       * 숨겨진 데이터셋은 취소선 범례 + 불투명도 0 으로 표시됩니다.
       */
      toggleable?: boolean;
    };
    tooltip?: {
      callbacks?: {
        /** 툴팁 각 행의 텍스트를 커스터마이징합니다 */
        label?: (context: { dataset: { label: string }; parsed: { y: number } }) => string;
      };
    };
  };
  scales?: {
    x?: {
      title?: { display?: boolean; text?: string };
    };
    y?: {
      stacked?: boolean;
      title?: { display?: boolean; text?: string };
      ticks?: {
        /** Y축 눈금 레이블을 커스터마이징합니다. 예: value => value + '초' */
        callback?: (value: number | string) => string;
      };
    };
  };
}

interface MixedChartProps {
  data: MixedChartData;
  options?: MixedChartOptions;
}

// ---------------------------------------------------------------------------
// 내부 헬퍼 타입
// ---------------------------------------------------------------------------

interface StackedBarColumn {
  segments: { bx: number; by: number; height: number; color: string; thickness: number; datasetLabel: string }[];
  colIndex: number;
  labelX: number;
  labelText: string;
}

interface LineOverlayPath {
  pathD: string;
  points: { x: number; y: number }[];
  borderColor: string;
  borderWidth: number;
  pointRadius: number;
  pointFill: string;
  /** 해당 데이터셋 레이블 (key 에 사용) */
  datasetLabel: string;
}

// ---------------------------------------------------------------------------
// 내부 SVG 서브 컴포넌트
// ---------------------------------------------------------------------------

function YGridLines({
  yTicks,
  yScale,
  totalWidth,
  formatYTick,
}: {
  yTicks: number[];
  yScale: (v: number) => number;
  totalWidth: number;
  formatYTick: (v: number) => string;
}) {
  return (
    <>
      {yTicks.map(tickVal => {
        const y = yScale(tickVal);
        return (
          <g key={tickVal}>
            <line x1={0} y1={y} x2={totalWidth} y2={y} stroke="#e5e7eb" strokeWidth={1} />
            <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
              {formatYTick(tickVal)}
            </text>
          </g>
        );
      })}
    </>
  );
}

function StackedBarGroup({
  col,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  innerHeight,
}: {
  col: StackedBarColumn;
  onMouseEnter: (e: React.MouseEvent, idx: number) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  innerHeight: number;
}) {
  return (
    <g
      onMouseEnter={e => onMouseEnter(e, col.colIndex)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      {col.segments.map(seg => (
        <rect
          key={seg.datasetLabel}
          x={seg.bx}
          y={seg.by}
          width={seg.thickness}
          height={Math.max(seg.height, 0)}
          fill={seg.color}
        />
      ))}
      <text x={col.labelX} y={innerHeight + 16} textAnchor="middle" fontSize={9} fill="#6b7280">
        {col.labelText}
      </text>
    </g>
  );
}

function LineOverlay({ overlay }: { overlay: LineOverlayPath }) {
  return (
    <g>
      {overlay.pathD && (
        <path d={overlay.pathD} fill="none" stroke={overlay.borderColor} strokeWidth={overlay.borderWidth} />
      )}
      {overlay.points.map(p => (
        <circle key={p.x} cx={p.x} cy={p.y} r={overlay.pointRadius} fill={overlay.pointFill} />
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// Catmull-Rom → cubic bezier path 빌더
// ---------------------------------------------------------------------------

function buildLinePath(points: { x: number; y: number }[], tension: number): string {
  if (points.length < 2) return '';
  if (tension === 0) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }
  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1]!;
      const next = points[i + 1] ?? p;
      const prevPrev = points[i - 2] ?? prev;
      const cp1x = prev.x + ((p.x - prevPrev.x) * tension) / 2;
      const cp1y = prev.y + ((p.y - prevPrev.y) * tension) / 2;
      const cp2x = p.x - ((next.x - prev.x) * tension) / 2;
      const cp2y = p.y - ((next.y - prev.y) * tension) / 2;
      return `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p.x} ${p.y}`;
    })
    .join(' ');
}

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------

/**
 * 막대 + 꺾은선 혼합 차트.
 *
 * 가장 자주 바꾸는 설정:
 * - 각 데이터셋의 type: 'bar' | 'line'
 * - Y축 레이블 포맷: `options.scales.y.ticks.callback`
 * - 툴팁 레이블 포맷: `options.plugins.tooltip.callbacks.label`
 * - 축 제목: `options.scales.x.title.text` / `options.scales.y.title.text`
 * - 범례 클릭 토글: `options.plugins.legend.toggleable`
 *
 * 애니메이션:
 * - 막대: 0에서 목표 높이까지 자랍니다.
 * - 선: 0(차트 바닥)에서 실제 값까지 올라옵니다.
 * - 값 변경 시: 이전 값에서 새 값으로 끊김 없이 전환됩니다.
 *
 * 레이아웃: 데이터가 적을 때는 컨테이너 너비를 가득 채우고,
 *           데이터가 많아 너비가 초과하면 가로 스크롤이 생깁니다.
 */
export const MixedChart = memo(function MixedChart({ data, options }: MixedChartProps) {
  const [tooltip, setTooltip] = useState<MultiTooltipState | null>(null);
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hideTooltip = useCallback(() => setTooltip(null), []);

  const { labels, datasets } = data;
  const n = labels.length;

  const showLegend = options?.plugins?.legend?.display !== false;
  const legendToggleable = options?.plugins?.legend?.toggleable ?? false;
  const xTitle = options?.scales?.x?.title?.display ? options.scales.x.title.text : null;
  const yTitle = options?.scales?.y?.title?.display ? options.scales.y.title.text : null;

  const formatYTick = useCallback(
    (value: number): string => {
      const cb = options?.scales?.y?.ticks?.callback;
      return cb ? cb(value) : String(Math.round(value));
    },
    [options?.scales?.y?.ticks?.callback],
  );

  const formatTooltipLabel = useCallback(
    (label: string, value: number): string => {
      const cb = options?.plugins?.tooltip?.callbacks?.label;
      return cb ? cb({ dataset: { label }, parsed: { y: value } }) : `${label}: ${value}`;
    },
    [options?.plugins?.tooltip?.callbacks?.label],
  );

  // -----------------------------------------------------------------------
  // 가시 데이터셋 분리
  // -----------------------------------------------------------------------
  const visibleDatasets = useMemo(() => datasets.filter((_, i) => !hiddenIndices.has(i)), [datasets, hiddenIndices]);
  const barDatasets = useMemo(() => visibleDatasets.filter(d => d.type === 'bar'), [visibleDatasets]);
  const lineDatasets = useMemo(() => visibleDatasets.filter(d => d.type === 'line'), [visibleDatasets]);

  // -----------------------------------------------------------------------
  // yMax 및 레이아웃 상수 계산 (TARGET 기준, 스케일 안정성 유지)
  // -----------------------------------------------------------------------
  const { yMax, innerHeight, totalWidth, viewWidth, yTicks, yScale, xCenter } = useMemo(() => {
    const stackedMax = Array.from({ length: n }, (_, col) =>
      barDatasets.reduce((sum, ds) => sum + (ds.data[col] ?? 0), 0),
    );
    const maxVal = Math.max(...stackedMax, ...lineDatasets.flatMap(d => d.data), 0);

    const baseBarSlot = Math.max(barDatasets[0]?.barThickness ?? 16, 16) + 8;
    const minSlot = MIN_BAR_SLOT;
    const innerAvail = Math.max(containerWidth - PAD_LEFT - PAD_RIGHT, 0);
    const slot = n > 0 ? Math.max(baseBarSlot, minSlot, Math.floor(innerAvail / n)) : baseBarSlot;

    const iH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
    const tW = n * slot;
    const vW = tW + PAD_LEFT + PAD_RIGHT;

    const scale = (value: number) => iH - (value / (maxVal || 1)) * iH;
    const center = (col: number) => col * slot + slot / 2;
    const ticks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, i) => (maxVal * i) / Y_TICK_COUNT);

    return {
      yMax: maxVal,
      innerHeight: iH,
      totalWidth: tW,
      viewWidth: vW,
      barSlot: slot,
      yTicks: ticks,
      yScale: scale,
      xCenter: center,
    };
  }, [barDatasets, lineDatasets, n, containerWidth]);

  // -----------------------------------------------------------------------
  // 막대 데이터 값 애니메이션 (가시 barDatasets × n 개의 값)
  // -----------------------------------------------------------------------
  const barTargets = useMemo<number[]>(() => barDatasets.flatMap(ds => ds.data), [barDatasets]);
  const animatedBarValues = useAnimatedValues(barTargets);

  // -----------------------------------------------------------------------
  // 선 데이터 값 애니메이션 (가시 lineDatasets × n 개의 값)
  // -----------------------------------------------------------------------
  const lineTargets = useMemo<number[]>(() => lineDatasets.flatMap(ds => ds.data), [lineDatasets]);
  const animatedLineValues = useAnimatedValues(lineTargets);

  // -----------------------------------------------------------------------
  // 애니메이션 값으로 막대 컬럼 구성
  // -----------------------------------------------------------------------
  const columns = useMemo<StackedBarColumn[]>(() => {
    return Array.from({ length: n }, (_, col) => {
      let stackBottom = innerHeight;
      const segments = barDatasets.map((ds, barDsIdx) => {
        const animValue = animatedBarValues[barDsIdx * n + col] ?? 0;
        const barH = (animValue / (yMax || 1)) * innerHeight;
        const bw = ds.barThickness ?? 16;
        const bx = xCenter(col) - bw / 2;
        const by = stackBottom - barH;
        stackBottom -= barH;
        return { bx, by, height: barH, color: ds.backgroundColor ?? '#888', thickness: bw, datasetLabel: ds.label };
      });
      return { segments, colIndex: col, labelX: xCenter(col), labelText: labels[col] ?? '' };
    });
  }, [barDatasets, animatedBarValues, n, innerHeight, yMax, xCenter, labels]);

  // -----------------------------------------------------------------------
  // 애니메이션 값으로 선 오버레이 구성
  // -----------------------------------------------------------------------
  const lineOverlays = useMemo<LineOverlayPath[]>(() => {
    return lineDatasets.map((ds, lineDsIdx) => {
      const pts = Array.from({ length: n }, (_, col) => {
        const animValue = animatedLineValues[lineDsIdx * n + col] ?? 0;
        return { x: xCenter(col), y: yScale(animValue) };
      });
      return {
        pathD: buildLinePath(pts, ds.tension ?? 0),
        points: pts,
        borderColor: ds.borderColor ?? '#888',
        borderWidth: ds.borderWidth ?? 2,
        pointRadius: ds.pointRadius ?? 4,
        pointFill: ds.pointBackgroundColor ?? ds.borderColor ?? '#888',
        datasetLabel: ds.label,
      };
    });
  }, [lineDatasets, animatedLineValues, n, xCenter, yScale]);

  // -----------------------------------------------------------------------
  // 범례 항목 (전체 데이터셋, 숨겨진 것도 포함)
  // -----------------------------------------------------------------------
  const legendItems = useMemo<LegendItem[]>(
    () => datasets.map(ds => ({ label: ds.label, color: ds.backgroundColor ?? ds.borderColor ?? '#ccc' })),
    [datasets],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, colIndex: number) => {
      const items: MultiTooltipItem[] = visibleDatasets.map(ds => ({
        label: ds.label,
        value: ds.data[colIndex] ?? 0,
        color: ds.backgroundColor ?? ds.borderColor ?? '#888',
      }));
      setTooltip({ x: e.clientX, y: e.clientY, title: labels[colIndex] ?? '', items });
    },
    [visibleDatasets, labels],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  }, []);

  const handleLegendToggle = useCallback((index: number) => {
    setHiddenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  if (n === 0) return null;

  return (
    <div style={{ width: '100%' }}>
      {showLegend && (
        <ChartLegend
          items={legendItems}
          toggleable={legendToggleable}
          hiddenIndices={hiddenIndices}
          onToggle={handleLegendToggle}
        />
      )}

      <div ref={containerRef} style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          width={viewWidth}
          height={CHART_HEIGHT}
          style={{ display: 'block', minWidth: '100%' }}
          role="img"
          aria-label="혼합 차트"
          onMouseLeave={hideTooltip}
        >
          <title>혼합 차트</title>
          <g transform={`translate(${PAD_LEFT}, ${PAD_TOP})`}>
            {yTitle && (
              <text
                x={-innerHeight / 2}
                y={-PAD_LEFT + 14}
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize={11}
                fill="#6b7280"
              >
                {yTitle}
              </text>
            )}

            <YGridLines yTicks={yTicks} yScale={yScale} totalWidth={totalWidth} formatYTick={formatYTick} />

            <line x1={0} y1={innerHeight} x2={totalWidth} y2={innerHeight} stroke="#d1d5db" strokeWidth={1} />

            {columns.map(col => (
              <StackedBarGroup
                key={col.labelText}
                col={col}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={hideTooltip}
                innerHeight={innerHeight}
              />
            ))}

            {lineOverlays.map(overlay => (
              <LineOverlay key={overlay.datasetLabel} overlay={overlay} />
            ))}
          </g>

          {xTitle && (
            <text x={PAD_LEFT + totalWidth / 2} y={CHART_HEIGHT - 6} textAnchor="middle" fontSize={11} fill="#6b7280">
              {xTitle}
            </text>
          )}
        </svg>
      </div>

      {tooltip && <MultiChartTooltip state={tooltip} formatLabel={formatTooltipLabel} />}
    </div>
  );
});
