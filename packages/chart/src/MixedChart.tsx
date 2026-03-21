import { useState, useRef, useCallback } from 'react';

type MixedDatasetType = 'bar' | 'line';

export interface MixedDataset {
  type: MixedDatasetType;
  label: string;
  data: number[];
  // bar options
  barThickness?: number;
  backgroundColor?: string;
  stack?: string;
  // line options
  borderColor?: string;
  borderWidth?: number;
  pointRadius?: number;
  pointBackgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

export interface MixedChartData {
  labels: string[];
  datasets: MixedDataset[];
}

export interface MixedChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: { position?: 'top' | 'bottom' | 'left' | 'right'; display?: boolean };
    tooltip?: {
      callbacks?: {
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
        callback?: (value: number | string) => string;
      };
    };
  };
}

interface MixedChartProps {
  data: MixedChartData;
  options?: MixedChartOptions;
}

interface TooltipState {
  x: number;
  y: number;
  items: { label: string; value: number; color: string }[];
  index: number;
}

function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hide = useCallback(() => setTooltip(null), []);
  return { tooltip, setTooltip, hide };
}

export function MixedChart({ data, options }: MixedChartProps) {
  const { tooltip, setTooltip, hide } = useTooltip();
  const containerRef = useRef<HTMLDivElement>(null);

  const { labels, datasets } = data;
  const n = labels.length;

  if (n === 0) return null;

  const barDatasets = datasets.filter(d => d.type === 'bar');
  const lineDatasets = datasets.filter(d => d.type === 'line');

  // Calculate stacked maximums per column
  const stackedMax = Array.from({ length: n }, (_, col) =>
    barDatasets.reduce((sum, ds) => sum + (ds.data[col] ?? 0), 0),
  );
  const yMax = Math.max(...stackedMax, ...lineDatasets.flatMap(d => d.data), 0);

  // Chart dimensions
  const padTop = 16;
  const padBottom = 56;
  const padLeft = 56;
  const padRight = 16;
  const chartHeight = 320;

  // Width per bar slot
  const barSlot = Math.max(barDatasets[0]?.barThickness ?? 16, 16) + 8;
  const totalWidth = n * barSlot;
  const viewWidth = totalWidth + padLeft + padRight;
  const innerHeight = chartHeight - padTop - padBottom;

  const yScale = (value: number) => innerHeight - (value / (yMax || 1)) * innerHeight;

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => (yMax * i) / yTickCount);

  const xCenter = (col: number) => col * barSlot + barSlot / 2;

  const formatYTick = (value: number) => {
    const cb = options?.scales?.y?.ticks?.callback;
    return cb ? cb(value) : String(Math.round(value));
  };

  const formatTooltipLabel = (dataset: MixedDataset, value: number) => {
    const cb = options?.plugins?.tooltip?.callbacks?.label;
    return cb ? cb({ dataset: { label: dataset.label }, parsed: { y: value } }) : `${dataset.label}: ${value}`;
  };

  const showLegend = options?.plugins?.legend?.display !== false;
  const xTitle = options?.scales?.x?.title?.display ? options.scales.x.title.text : null;
  const yTitle = options?.scales?.y?.title?.display ? options.scales.y.title.text : null;

  const handleMouseEnter = (e: React.MouseEvent, colIndex: number) => {
    const items = datasets.map(ds => ({
      label: ds.label,
      value: ds.data[colIndex] ?? 0,
      color: ds.backgroundColor ?? ds.borderColor ?? '#888',
    }));
    setTooltip({ x: e.clientX, y: e.clientY, items, index: colIndex });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  };

  return (
    <div ref={containerRef}>
      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {datasets.map((ds, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: ds.backgroundColor ?? ds.borderColor ?? '#ccc' }}
              />
              <span>{ds.label}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <svg width={viewWidth} height={chartHeight} style={{ display: 'block' }} onMouseLeave={hide}>
          <g transform={`translate(${padLeft}, ${padTop})`}>
            {/* Y axis title */}
            {yTitle && (
              <text
                x={-innerHeight / 2}
                y={-padLeft + 14}
                transform={`rotate(-90)`}
                textAnchor="middle"
                fontSize={11}
                fill="#6b7280"
              >
                {yTitle}
              </text>
            )}

            {/* Y axis ticks and grid lines */}
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

            {/* X axis */}
            <line x1={0} y1={innerHeight} x2={totalWidth} y2={innerHeight} stroke="#d1d5db" strokeWidth={1} />

            {/* Stacked bars */}
            {Array.from({ length: n }, (_, col) => {
              let stackBottom = innerHeight;
              return (
                <g
                  key={col}
                  onMouseEnter={e => handleMouseEnter(e, col)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={hide}
                  style={{ cursor: 'pointer' }}
                >
                  {barDatasets.map((ds, di) => {
                    const value = ds.data[col] ?? 0;
                    const barH = (value / (yMax || 1)) * innerHeight;
                    const bw = ds.barThickness ?? 16;
                    const bx = xCenter(col) - bw / 2;
                    const by = stackBottom - barH;
                    stackBottom -= barH;
                    return (
                      <rect
                        key={di}
                        x={bx}
                        y={by}
                        width={bw}
                        height={Math.max(barH, 0)}
                        fill={ds.backgroundColor ?? '#888'}
                      />
                    );
                  })}
                  {/* X label */}
                  <text
                    x={xCenter(col)}
                    y={innerHeight + 16}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#6b7280"
                    transform={n > 20 ? `rotate(-45, ${xCenter(col)}, ${innerHeight + 16})` : undefined}
                  >
                    {labels[col]}
                  </text>
                </g>
              );
            })}

            {/* Line overlays */}
            {lineDatasets.map((ds, li) => {
              const points = ds.data.map((v, col) => ({ x: xCenter(col), y: yScale(v) }));
              const pw = ds.borderWidth ?? 2;
              const pr = ds.pointRadius ?? 4;

              // Build SVG path with optional tension
              let pathD = '';
              if (points.length > 1) {
                const t = ds.tension ?? 0;
                if (t === 0) {
                  pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                } else {
                  // Catmull-Rom to cubic bezier approximation
                  pathD = points
                    .map((p, i) => {
                      if (i === 0) return `M ${p.x} ${p.y}`;
                      const prev = points[i - 1]!;
                      const next = points[i + 1] ?? p;
                      const prevPrev = points[i - 2] ?? prev;
                      const cp1x = prev.x + ((p.x - prevPrev.x) * t) / 2;
                      const cp1y = prev.y + ((p.y - prevPrev.y) * t) / 2;
                      const cp2x = p.x - ((next.x - prev.x) * t) / 2;
                      const cp2y = p.y - ((next.y - prev.y) * t) / 2;
                      return `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p.x} ${p.y}`;
                    })
                    .join(' ');
                }
              }

              return (
                <g key={li}>
                  {pathD && <path d={pathD} fill="none" stroke={ds.borderColor ?? '#888'} strokeWidth={pw} />}
                  {points.map((p, pi) => (
                    <circle
                      key={pi}
                      cx={p.x}
                      cy={p.y}
                      r={pr}
                      fill={ds.pointBackgroundColor ?? ds.borderColor ?? '#888'}
                    />
                  ))}
                </g>
              );
            })}
          </g>

          {/* X axis title */}
          {xTitle && (
            <text x={padLeft + totalWidth / 2} y={chartHeight - 6} textAnchor="middle" fontSize={11} fill="#6b7280">
              {xTitle}
            </text>
          )}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          style={{ position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 10, zIndex: 1000, pointerEvents: 'none' }}
          className="bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg min-w-max"
        >
          <div className="font-semibold mb-1">{labels[tooltip.index]}</div>
          {tooltip.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
              <span>{formatTooltipLabel(datasets[i]!, item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
