import { useState } from 'react';

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

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function RadarChart({ data, options, className }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);

  const { labels, datasets } = data;
  const n = labels.length;

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const r = 140;

  const suggestedMin = options?.scales?.r?.suggestedMin ?? 0;
  const suggestedMax = options?.scales?.r?.suggestedMax ?? 100;
  const range = suggestedMax - suggestedMin;

  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;
  const pointLabelColor = options?.scales?.r?.pointLabels?.color ?? '#374151';
  const pointLabelFontSize = options?.scales?.r?.pointLabels?.font?.size ?? 12;
  const gridColor = options?.scales?.r?.grid?.color ?? '#E5E7EB';
  const showAngleLines = options?.scales?.r?.angleLines?.display !== false;

  const angleForIndex = (i: number) => toRad((360 / n) * i) - Math.PI / 2;

  const toCoord = (value: number, i: number) => {
    const angle = angleForIndex(i);
    const normalized = range > 0 ? (value - suggestedMin) / range : 0;
    const dist = Math.min(Math.max(normalized, 0), 1) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  const gridLevels = 5;

  const gridPolygon = (level: number) => {
    const fr = (r * level) / gridLevels;
    return Array.from({ length: n }, (_, i) => {
      const angle = angleForIndex(i);
      return `${cx + fr * Math.cos(angle)},${cy + fr * Math.sin(angle)}`;
    }).join(' ');
  };

  const dataPolygon = (dataset: RadarDataset) => {
    return dataset.data
      .map((value, i) => {
        const { x, y } = toCoord(value, i);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        {/* Grid polygons */}
        {Array.from({ length: gridLevels }, (_, level) => (
          <polygon key={level} points={gridPolygon(level + 1)} fill="none" stroke={gridColor} strokeWidth={1} />
        ))}

        {/* Angle lines */}
        {showAngleLines &&
          labels.map((_, i) => {
            const angle = angleForIndex(i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + r * Math.cos(angle)}
                y2={cy + r * Math.sin(angle)}
                stroke={gridColor}
                strokeWidth={1}
              />
            );
          })}

        {/* Dataset polygons */}
        {datasets.map((dataset, di) => (
          <g key={di}>
            <polygon
              points={dataPolygon(dataset)}
              fill={dataset.backgroundColor}
              stroke={dataset.borderColor}
              strokeWidth={dataset.borderWidth}
            />
            {/* Data points */}
            {dataset.data.map((value, i) => {
              const { x, y } = toCoord(value, i);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={dataset.pointBackgroundColor}
                  style={{ cursor: showTooltip ? 'pointer' : 'default' }}
                  onMouseEnter={e => {
                    if (showTooltip) {
                      setTooltip({ x: e.clientX, y: e.clientY, label: `${dataset.label}: ${labels[i]}`, value });
                    }
                  }}
                  onMouseMove={e => {
                    if (showTooltip && tooltip) {
                      setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </g>
        ))}

        {/* Point labels */}
        {labels.map((label, i) => {
          const angle = angleForIndex(i);
          const labelR = r + 24;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={pointLabelFontSize}
              fill={pointLabelColor}
            >
              {label}
            </text>
          );
        })}
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
          {datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: dataset.borderColor }} />
              <span>{dataset.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
