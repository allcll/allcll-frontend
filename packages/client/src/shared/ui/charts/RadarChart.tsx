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
const RADIUS = 140;

function angleForIndex(i: number, n: number) {
  return ((Math.PI * 2) / n) * i - Math.PI / 2;
}

export function RadarChart({ data, options, className }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

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
    range: [0, RADIUS],
    clamp: true,
  });

  const toCoord = (value: number, i: number) => {
    const angle = angleForIndex(i, n);
    const dist = rScale(value) ?? 0;
    return { x: CX + dist * Math.cos(angle), y: CY + dist * Math.sin(angle) };
  };

  const gridPolygon = (level: number) =>
    Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i, n);
      const r = (RADIUS * level) / GRID_LEVELS;
      return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
    }).join(' ');

  const dataPolygon = (dataset: RadarDataset) =>
    dataset.data
      .map((v, i) => {
        const { x, y } = toCoord(v, i);
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%">
        <Group>
          {/* Grid polygons */}
          {Array.from({ length: GRID_LEVELS }, (_, level) => (
            <polygon key={level} points={gridPolygon(level + 1)} fill="none" stroke={gridColor} strokeWidth={1} />
          ))}

          {/* Angle lines */}
          {showAngleLines &&
            labels.map((_, i) => {
              const angle = angleForIndex(i, n);
              return (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={CX + RADIUS * Math.cos(angle)}
                  y2={CY + RADIUS * Math.sin(angle)}
                  stroke={gridColor}
                  strokeWidth={1}
                />
              );
            })}

          {/* Dataset polygons */}
          {datasets.map((ds, di) => (
            <g key={di}>
              <polygon
                points={dataPolygon(ds)}
                fill={ds.backgroundColor}
                stroke={ds.borderColor}
                strokeWidth={ds.borderWidth}
              />
              {ds.data.map((value, i) => {
                const { x, y } = toCoord(value, i);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={4}
                    fill={ds.pointBackgroundColor}
                    style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                    onMouseEnter={e => {
                      if (showTooltip)
                        setTooltip({ x: e.clientX, y: e.clientY, label: `${ds.label}: ${labels[i]}`, value });
                    }}
                    onMouseMove={e => {
                      if (showTooltip) setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          ))}

          {/* Point labels */}
          {labels.map((label, i) => {
            const angle = angleForIndex(i, n);
            const labelR = RADIUS + 24;
            return (
              <text
                key={i}
                x={CX + labelR * Math.cos(angle)}
                y={CY + labelR * Math.sin(angle)}
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

      {showTooltip && tooltip && (
        <div
          style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 28, zIndex: 1000, pointerEvents: 'none' }}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow"
        >
          {tooltip.label}: {tooltip.value}
        </div>
      )}

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {datasets.map((ds, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: ds.borderColor }} />
              <span>{ds.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
