import { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';
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
/** 요소 페이드인 재생 시간 (초) */
const ANIM_DUR_S = 0.5;

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
  /** 각 barDataset 의 (x, y, height) 정보 */
  segments: { bx: number; by: number; height: number; color: string; thickness: number }[];
  /** 툴팁 인덱스 참조용 */
  colIndex: number;
  /** x 레이블 중심 좌표 */
  labelX: number;
  /** x 레이블 텍스트 */
  labelText: string;
}

interface LineOverlayPath {
  pathD: string;
  points: { x: number; y: number }[];
  borderColor: string;
  borderWidth: number;
  pointRadius: number;
  pointFill: string;
}

interface ChartLayout {
  barDatasets: MixedDataset[];
  yMax: number;
  totalWidth: number;
  innerHeight: number;
  viewWidth: number;
  yScale: (v: number) => number;
  yTicks: number[];
  columns: StackedBarColumn[];
  lineOverlays: LineOverlayPath[];
}

// ---------------------------------------------------------------------------
// 내부 SVG 서브 컴포넌트
// ---------------------------------------------------------------------------

/** Y축 눈금 + 격자선 */
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
      {yTicks.map((tickVal, i) => {
        const y = yScale(tickVal);
        return (
          <g key={i}>
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

/** 쌓인 막대 단일 컬럼 */
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
      {col.segments.map((seg, di) => (
        <rect key={di} x={seg.bx} y={seg.by} width={seg.thickness} height={Math.max(seg.height, 0)} fill={seg.color}>
          {/* 막대 성장 애니메이션 */}
          <animate attributeName="height" from="0" to={Math.max(seg.height, 0)} dur={`${ANIM_DUR_S}s`} fill="freeze" />
          <animate attributeName="y" from={innerHeight} to={seg.by} dur={`${ANIM_DUR_S}s`} fill="freeze" />
        </rect>
      ))}
      <text x={col.labelX} y={innerHeight + 16} textAnchor="middle" fontSize={9} fill="#6b7280">
        {col.labelText}
      </text>
    </g>
  );
}

/** 선 그래프 오버레이 */
function LineOverlay({ overlay }: { overlay: LineOverlayPath }) {
  return (
    <g>
      {overlay.pathD && (
        <path d={overlay.pathD} fill="none" stroke={overlay.borderColor} strokeWidth={overlay.borderWidth}>
          <animate attributeName="opacity" from="0" to="1" dur={`${ANIM_DUR_S + 0.1}s`} fill="freeze" />
        </path>
      )}
      {overlay.points.map((p, pi) => (
        <circle key={pi} cx={p.x} cy={p.y} r={overlay.pointRadius} fill={overlay.pointFill}>
          <animate attributeName="opacity" from="0" to="1" dur={`${ANIM_DUR_S + 0.1}s`} fill="freeze" />
        </circle>
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
  // Catmull-Rom to cubic bezier approximation
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
 * 레이아웃: 데이터가 적을 때는 컨테이너 너비를 가득 채우고,
 *           데이터가 많아 너비가 초과하면 가로 스크롤이 생깁니다.
 */
export const MixedChart = memo(function MixedChart({ data, options }: MixedChartProps) {
  const [tooltip, setTooltip] = useState<MultiTooltipState | null>(null);
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());
  // 컨테이너 너비를 감지해 데이터가 적을 때 막대를 자동 확장합니다
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

  // 옵션 파생값
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

  // SVG 레이아웃 계산 (data, hiddenIndices, containerWidth 가 바뀔 때만)
  const layout = useMemo<ChartLayout>(() => {
    // 숨겨진 데이터셋 제외
    const visibleDatasets = datasets.filter((_, i) => !hiddenIndices.has(i));
    const barDatasets = visibleDatasets.filter(d => d.type === 'bar');
    const lineDatasets = visibleDatasets.filter(d => d.type === 'line');

    const stackedMax = Array.from({ length: n }, (_, col) =>
      barDatasets.reduce((sum, ds) => sum + (ds.data[col] ?? 0), 0),
    );
    const yMax = Math.max(...stackedMax, ...lineDatasets.flatMap(d => d.data), 0);

    // barSlot: 데이터가 적을 때는 컨테이너를 채우도록 확장
    const baseBarSlot = Math.max(barDatasets[0]?.barThickness ?? 16, 16) + 8;
    const minSlot = MIN_BAR_SLOT;
    const innerAvailable = Math.max(containerWidth - PAD_LEFT - PAD_RIGHT, 0);
    // 컨테이너를 채울 수 있는 슬롯 크기와 기본값 중 큰 값 사용
    const barSlot = n > 0 ? Math.max(baseBarSlot, minSlot, Math.floor(innerAvailable / n)) : baseBarSlot;

    const totalWidth = n * barSlot;
    const innerHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
    const viewWidth = totalWidth + PAD_LEFT + PAD_RIGHT;

    const yScale = (value: number) => innerHeight - (value / (yMax || 1)) * innerHeight;
    const xCenter = (col: number) => col * barSlot + barSlot / 2;
    const yTicks = Array.from({ length: Y_TICK_COUNT + 1 }, (_, i) => (yMax * i) / Y_TICK_COUNT);

    // 막대 컬럼
    const columns: StackedBarColumn[] = Array.from({ length: n }, (_, col) => {
      let stackBottom = innerHeight;
      const segments = barDatasets.map(ds => {
        const value = ds.data[col] ?? 0;
        const barH = (value / (yMax || 1)) * innerHeight;
        const bw = ds.barThickness ?? 16;
        const bx = xCenter(col) - bw / 2;
        const by = stackBottom - barH;
        stackBottom -= barH;
        return { bx, by, height: barH, color: ds.backgroundColor ?? '#888', thickness: bw };
      });
      return { segments, colIndex: col, labelX: xCenter(col), labelText: labels[col] ?? '' };
    });

    // 선 오버레이
    const lineOverlays: LineOverlayPath[] = lineDatasets.map(ds => {
      const pts = ds.data.map((v, col) => ({ x: xCenter(col), y: yScale(v) }));
      return {
        pathD: buildLinePath(pts, ds.tension ?? 0),
        points: pts,
        borderColor: ds.borderColor ?? '#888',
        borderWidth: ds.borderWidth ?? 2,
        pointRadius: ds.pointRadius ?? 4,
        pointFill: ds.pointBackgroundColor ?? ds.borderColor ?? '#888',
      };
    });

    return { barDatasets, yMax, totalWidth, innerHeight, viewWidth, yScale, yTicks, columns, lineOverlays };
  }, [datasets, labels, n, hiddenIndices, containerWidth]);

  // 범례 항목 (전체 데이터셋, 숨겨진 것도 포함)
  const legendItems = useMemo<LegendItem[]>(
    () => datasets.map(ds => ({ label: ds.label, color: ds.backgroundColor ?? ds.borderColor ?? '#ccc' })),
    [datasets],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, colIndex: number) => {
      const visibleDatasets = datasets.filter((_, i) => !hiddenIndices.has(i));
      const items: MultiTooltipItem[] = visibleDatasets.map(ds => ({
        label: ds.label,
        value: ds.data[colIndex] ?? 0,
        color: ds.backgroundColor ?? ds.borderColor ?? '#888',
      }));
      setTooltip({ x: e.clientX, y: e.clientY, title: labels[colIndex] ?? '', items });
    },
    [datasets, labels, hiddenIndices],
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
      {/* 범례 */}
      {showLegend && (
        <ChartLegend
          items={legendItems}
          toggleable={legendToggleable}
          hiddenIndices={hiddenIndices}
          onToggle={handleLegendToggle}
        />
      )}

      {/*
       * ref로 컨테이너 너비를 감지합니다.
       * overflow-x: auto 로 데이터가 많으면 가로 스크롤을 허용합니다.
       */}
      <div ref={containerRef} style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          width={layout.viewWidth}
          height={CHART_HEIGHT}
          style={{ display: 'block', minWidth: '100%' }}
          role="img"
          aria-label="혼합 차트"
          onMouseLeave={hideTooltip}
        >
          <g transform={`translate(${PAD_LEFT}, ${PAD_TOP})`}>
            {/* Y축 제목 */}
            {yTitle && (
              <text
                x={-layout.innerHeight / 2}
                y={-PAD_LEFT + 14}
                transform="rotate(-90)"
                textAnchor="middle"
                fontSize={11}
                fill="#6b7280"
              >
                {yTitle}
              </text>
            )}

            {/* Y축 격자선 */}
            <YGridLines
              yTicks={layout.yTicks}
              yScale={layout.yScale}
              totalWidth={layout.totalWidth}
              formatYTick={formatYTick}
            />

            {/* X축 */}
            <line
              x1={0}
              y1={layout.innerHeight}
              x2={layout.totalWidth}
              y2={layout.innerHeight}
              stroke="#d1d5db"
              strokeWidth={1}
            />

            {/* 쌓인 막대 */}
            {layout.columns.map(col => (
              <StackedBarGroup
                key={col.colIndex}
                col={col}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={hideTooltip}
                innerHeight={layout.innerHeight}
              />
            ))}

            {/* 선 오버레이 */}
            {layout.lineOverlays.map((overlay, li) => (
              <LineOverlay key={li} overlay={overlay} />
            ))}
          </g>

          {/* X축 제목 */}
          {xTitle && (
            <text
              x={PAD_LEFT + layout.totalWidth / 2}
              y={CHART_HEIGHT - 6}
              textAnchor="middle"
              fontSize={11}
              fill="#6b7280"
            >
              {xTitle}
            </text>
          )}
        </svg>
      </div>

      {/* 툴팁 */}
      {tooltip && <MultiChartTooltip state={tooltip} formatLabel={formatTooltipLabel} />}
    </div>
  );
});
