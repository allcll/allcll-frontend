import { useState } from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';

export interface RadarDataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  pointBackgroundColor: string;
}

export interface RadarChartData {
  labels: string[];
  datasets: RadarDataset[];
}

export interface RadarChartOptions {
  responsive?: boolean;
  scales?: {
    r?: {
      angleLines?: { display?: boolean };
      suggestedMin?: number;
      suggestedMax?: number;
      ticks?: { display?: boolean };
      pointLabels?: {
        font?: { size?: number };
        color?: string;
      };
      grid?: { color?: string };
    };
  };
  plugins?: {
    legend?: { display?: boolean };
    tooltip?: { enabled?: boolean };
  };
}

interface RadarChartProps {
  data: RadarChartData;
  options?: RadarChartOptions;
  className?: string;
}

const GRID_LEVELS = 5;
const SIZE = 400;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADAR_RADIUS = 140;
const LABEL_RADIUS = RADAR_RADIUS + 24;

function angleForIndex(i: number, n: number) {
  return ((Math.PI * 2) / n) * i - Math.PI / 2;
}

interface TooltipState {
  x: number;
  y: number;
  label: string;
  value: number;
}

function DatasetPolygon({
  ds,
  n,
  rScale,
  showTooltip,
  labels,
  onPointEnter,
  onPointMove,
  onPointLeave,
}: {
  ds: RadarDataset;
  n: number;
  rScale: (v: number) => number;
  showTooltip: boolean;
  labels: string[];
  onPointEnter: (e: React.MouseEvent, label: string, value: number) => void;
  onPointMove: (e: React.MouseEvent) => void;
  onPointLeave: () => void;
}) {
  const toCoord = (value: number, i: number) => {
    const angle = angleForIndex(i, n);
    const dist = rScale(value);
    return { x: CX + dist * Math.cos(angle), y: CY + dist * Math.sin(angle) };
  };

  const polygonPoints = ds.data
    .map((v, i) => {
      const { x, y } = toCoord(v, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <g>
      <polygon points={polygonPoints} fill={ds.backgroundColor} stroke={ds.borderColor} strokeWidth={ds.borderWidth} />
      {ds.data.map((v, i) => {
        const { x, y } = toCoord(v, i);
        const pointKey = labels[i] ?? `point-${i}`;
        return (
          <circle
            key={pointKey}
            cx={x}
            cy={y}
            r={4}
            fill={ds.pointBackgroundColor}
            style={{ cursor: showTooltip ? 'pointer' : 'default' }}
            onMouseEnter={e => onPointEnter(e, `${ds.label}: ${labels[i] ?? i}`, ds.data[i] ?? 0)}
            onMouseMove={onPointMove}
            onMouseLeave={onPointLeave}
          />
        );
      })}
    </g>
  );
}

export function RadarChart({ data, options, className }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { labels, datasets } = data;
  const n = labels.length;

  const suggestedMin = options?.scales?.r?.suggestedMin ?? 0;
  const suggestedMax = options?.scales?.r?.suggestedMax ?? 100;
  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const pointLabelColor = options?.scales?.r?.pointLabels?.color ?? '#374151';
  const pointLabelFontSize = options?.scales?.r?.pointLabels?.font?.size ?? 12;
  const gridColor = options?.scales?.r?.grid?.color ?? '#E5E7EB';
  const showAngleLines = options?.scales?.r?.angleLines?.display !== false;

  const rScale = scaleLinear<number>({
    domain: [suggestedMin, suggestedMax],
    range: [0, RADAR_RADIUS],
    clamp: true,
  });

  const gridPolygon = (level: number) =>
    Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i, n);
      const r = (RADAR_RADIUS * level) / GRID_LEVELS;
      return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
    }).join(' ');

  const hideTooltip = () => setTooltip(null);

  const handlePointEnter = (e: React.MouseEvent, label: string, value: number) => {
    if (showTooltip) setTooltip({ x: e.clientX, y: e.clientY, label, value });
  };

  const handlePointMove = (e: React.MouseEvent) => {
    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
  };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" role="img" aria-label="레이더 차트">
        <title>레이더 차트</title>
        <Group>
          {Array.from({ length: GRID_LEVELS }, (_, level) => (
            <polygon
              key={`grid-level-${level + 1}`}
              points={gridPolygon(level + 1)}
              fill="none"
              stroke={gridColor}
              strokeWidth={1}
            />
          ))}

          {showAngleLines &&
            labels.map((label, i) => {
              const angle = angleForIndex(i, n);
              return (
                <line
                  key={label}
                  x1={CX}
                  y1={CY}
                  x2={CX + RADAR_RADIUS * Math.cos(angle)}
                  y2={CY + RADAR_RADIUS * Math.sin(angle)}
                  stroke={gridColor}
                  strokeWidth={1}
                />
              );
            })}

          {datasets.map(ds => (
            <DatasetPolygon
              key={ds.label}
              ds={ds}
              n={n}
              rScale={v => rScale(v) ?? 0}
              showTooltip={showTooltip}
              labels={labels}
              onPointEnter={handlePointEnter}
              onPointMove={handlePointMove}
              onPointLeave={hideTooltip}
            />
          ))}

          {labels.map((label, i) => {
            const angle = angleForIndex(i, n);
            return (
              <text
                key={label}
                x={CX + LABEL_RADIUS * Math.cos(angle)}
                y={CY + LABEL_RADIUS * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={pointLabelFontSize}
                fill={pointLabelColor}
              >
                {label}
              </text>
            );
          })}
        </Group>
      </svg>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {datasets.map(ds => (
            <div key={ds.label} className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: ds.borderColor }} />
              <span>{ds.label}</span>
            </div>
          ))}
        </div>
      )}

      {showTooltip && tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 28,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
          role="tooltip"
          aria-live="polite"
        >
          {tooltip.label}: {tooltip.value}
        </div>
      )}
    </div>
  );
}
