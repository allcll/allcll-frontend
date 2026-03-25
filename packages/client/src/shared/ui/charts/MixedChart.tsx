import { useState, useCallback } from 'react';
import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';

type MixedDatasetType = 'bar' | 'line';

export interface MixedDataset {
  type: MixedDatasetType;
  label: string;
  data: number[];
  barThickness?: number;
  backgroundColor?: string;
  stack?: string;
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
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
    };
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

const PAD_TOP = 16;
const PAD_BOTTOM = 56;
const PAD_LEFT = 56;
const PAD_RIGHT = 16;
const CHART_HEIGHT = 320;

function formatTooltipLabel(ds: MixedDataset, value: number, options?: MixedChartOptions): string {
  const cb = options?.plugins?.tooltip?.callbacks?.label;
  if (cb) return cb({ dataset: { label: ds.label }, parsed: { y: value } });
  return `${ds.label}: ${value}`;
}

/**
 * AxisLeft의 tickFormat은 d3의 NumberValue(valueOf(): number)를 전달합니다.
 * 숫자 원시값과 NumberValue 객체 모두 처리합니다.
 */
function formatYTick(value: { valueOf(): number } | string | number, options?: MixedChartOptions): string {
  const numVal = typeof value === 'string' ? value : typeof value === 'number' ? value : value.valueOf();
  const cb = options?.scales?.y?.ticks?.callback;
  if (cb) return cb(numVal);
  return typeof numVal === 'number' ? String(Math.round(numVal)) : String(numVal);
}

export function MixedChart({ data, options }: MixedChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hide = useCallback(() => setTooltip(null), []);

  const { labels, datasets } = data;
  const n = labels.length;

  if (n === 0) return null;

  const showLegend = options?.plugins?.legend?.display !== false;
  const xTitle = options?.scales?.x?.title?.display ? options.scales.x.title.text : null;
  const yTitle = options?.scales?.y?.title?.display ? options.scales.y.title.text : null;

  const barDatasets = datasets.filter(d => d.type === 'bar');
  const lineDatasets = datasets.filter(d => d.type === 'line');

  const stackedSums = Array.from({ length: n }, (_, col) =>
    barDatasets.reduce((sum, ds) => sum + (ds.data[col] ?? 0), 0),
  );
  const rawLineMax = lineDatasets.flatMap(d => d.data);
  const yMax = Math.max(...stackedSums, ...rawLineMax, 0);

  const bw = Math.max(barDatasets[0]?.barThickness ?? 16, 16);
  const barSlot = bw + 8;
  const innerWidth = n * barSlot;
  const innerHeight = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const viewWidth = innerWidth + PAD_LEFT + PAD_RIGHT;

  const xScale = scaleBand<number>({
    domain: Array.from({ length: n }, (_, i) => i),
    range: [0, innerWidth],
    padding: 0.1,
  });

  const yScale = scaleLinear<number>({
    domain: [0, yMax * 1.05 || 1],
    range: [innerHeight, 0],
    nice: true,
  });

  const xCenter = (col: number) => (xScale(col) ?? 0) + xScale.bandwidth() / 2;

  const handleMouseEnter = (e: React.MouseEvent, col: number) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      items: datasets.map(ds => ({
        label: ds.label,
        value: ds.data[col] ?? 0,
        color: ds.backgroundColor ?? ds.borderColor ?? '#888',
      })),
      index: col,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) =>
    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));

  return (
    <div>
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {datasets.map(ds => (
            <div key={ds.label} className="flex items-center gap-1 text-xs">
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
        <svg
          width={viewWidth}
          height={CHART_HEIGHT}
          style={{ display: 'block' }}
          role="img"
          aria-label="혼합 차트"
          onMouseLeave={hide}
        >
          <title>혼합 차트</title>
          <Group left={PAD_LEFT} top={PAD_TOP}>
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

            <AxisLeft scale={yScale} numTicks={5} tickFormat={v => formatYTick(v, options)} />

            <AxisBottom
              top={innerHeight}
              scale={xScale}
              tickFormat={v => labels[v as number] ?? ''}
              tickLabelProps={() => ({
                fontSize: 9,
                fill: '#6b7280',
                textAnchor: 'middle' as const,
                ...(n > 20 ? { transform: `rotate(-45)`, textAnchor: 'end' as const } : {}),
              })}
            />

            {Array.from({ length: n }, (_, col) => {
              let stackY = yScale(0) ?? innerHeight;
              return (
                <g
                  key={labels[col]}
                  onMouseEnter={e => handleMouseEnter(e, col)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={hide}
                  style={{ cursor: 'pointer' }}
                >
                  {barDatasets.map(ds => {
                    const value = ds.data[col] ?? 0;
                    const barH = Math.max((yScale(0) ?? innerHeight) - (yScale(value) ?? 0), 0);
                    const barY = stackY - barH;
                    stackY = barY;
                    return (
                      <Bar
                        key={ds.label}
                        x={xCenter(col) - bw / 2}
                        y={barY}
                        width={bw}
                        height={barH}
                        fill={ds.backgroundColor ?? '#888'}
                      />
                    );
                  })}
                </g>
              );
            })}

            {lineDatasets.map(ds => {
              const pts = ds.data.map((v, col) => ({ x: xCenter(col), y: yScale(v) ?? 0 }));
              const pr = ds.pointRadius ?? 4;
              const pw = ds.borderWidth ?? 2;
              return (
                <g key={ds.label}>
                  <LinePath
                    data={pts}
                    x={p => p.x}
                    y={p => p.y}
                    stroke={ds.borderColor ?? '#888'}
                    strokeWidth={pw}
                    fill="none"
                  />
                  {pts.map((p, pi) => (
                    <circle
                      key={`${ds.label}-${labels[pi]}`}
                      cx={p.x}
                      cy={p.y}
                      r={pr}
                      fill={ds.pointBackgroundColor ?? ds.borderColor ?? '#888'}
                    />
                  ))}
                </g>
              );
            })}
          </Group>

          {xTitle && (
            <text x={PAD_LEFT + innerWidth / 2} y={CHART_HEIGHT - 6} textAnchor="middle" fontSize={11} fill="#6b7280">
              {xTitle}
            </text>
          )}
        </svg>
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          className="bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg min-w-max"
          role="tooltip"
          aria-live="polite"
        >
          <div className="font-semibold mb-1">{labels[tooltip.index]}</div>
          {tooltip.items.map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
              <span>{formatTooltipLabel({ label: item.label, type: 'bar', data: [] }, item.value, options)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
