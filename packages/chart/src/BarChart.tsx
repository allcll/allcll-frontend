import { useState } from 'react';

export interface BarDataset {
  data: number[];
  backgroundColor: string | string[];
  label?: string;
}

export interface BarChartData {
  labels: string[];
  datasets: BarDataset[];
}

interface BarChartProps {
  data: BarChartData;
  className?: string;
}

function getColor(backgroundColor: string | string[], i: number): string {
  return Array.isArray(backgroundColor) ? (backgroundColor[i % backgroundColor.length] ?? '#ccc') : backgroundColor;
}

export function BarChart({ data, className }: BarChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const { labels, datasets } = data;
  const dataset = datasets[0];
  if (!dataset) return null;

  const values = dataset.data;
  const max = Math.max(...values, 0);

  const viewWidth = 300;
  const viewHeight = 220;
  const padTop = 10;
  const padRight = 10;
  const padBottom = 40;
  const padLeft = 30;
  const chartWidth = viewWidth - padLeft - padRight;
  const chartHeight = viewHeight - padTop - padBottom;

  const barSlotWidth = chartWidth / values.length;
  const barWidth = Math.min(barSlotWidth * 0.6, 40);

  const yTicks = 4;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} width="100%" height="100%">
        <g transform={`translate(${padLeft}, ${padTop})`}>
          {/* Y-axis grid lines and tick labels */}
          {Array.from({ length: yTicks + 1 }, (_, i) => {
            const yVal = (max * i) / yTicks;
            const yPos = chartHeight - (yVal / (max || 1)) * chartHeight;
            return (
              <g key={i}>
                <line x1={0} y1={yPos} x2={chartWidth} y2={yPos} stroke="#e5e7eb" strokeWidth={1} />
                <text x={-4} y={yPos + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                  {Math.round(yVal)}
                </text>
              </g>
            );
          })}

          {/* X-axis */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#d1d5db" strokeWidth={1} />

          {/* Bars */}
          {values.map((value, i) => {
            const barHeight = max > 0 ? (value / max) * chartHeight : 0;
            const x = i * barSlotWidth + (barSlotWidth - barWidth) / 2;
            const y = chartHeight - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={getColor(dataset.backgroundColor, i)}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => {
                    setTooltip({ x: e.clientX, y: e.clientY, label: labels[i] ?? '', value });
                  }}
                  onMouseMove={e => {
                    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text x={x + barWidth / 2} y={chartHeight + 16} textAnchor="middle" fontSize={10} fill="#6b7280">
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {tooltip && (
        <div
          style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 28, zIndex: 1000, pointerEvents: 'none' }}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow"
        >
          {tooltip.label}: {tooltip.value}
        </div>
      )}
    </div>
  );
}
