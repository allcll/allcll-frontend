import { useState } from 'react';

export interface DoughnutDataset {
  data: number[];
  backgroundColor?: string | string[];
  borderWidth?: number;
  cutout?: string;
}

export interface DoughnutChartData {
  labels?: string[];
  datasets: DoughnutDataset[];
}

export interface DoughnutChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: { display?: boolean };
    tooltip?: { enabled?: boolean };
  };
}

interface DoughnutChartProps {
  data: DoughnutChartData;
  options?: DoughnutChartOptions;
  className?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function arcPath(cx: number, cy: number, r: number, innerR: number, startAngle: number, endAngle: number): string {
  const outerStart = polarToCartesian(cx, cy, r, startAngle);
  const outerEnd = polarToCartesian(cx, cy, r, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function getColor(backgroundColor: string | string[] | undefined, i: number): string {
  if (!backgroundColor) return '#ccc';
  return Array.isArray(backgroundColor) ? (backgroundColor[i % backgroundColor.length] ?? '#ccc') : backgroundColor;
}

export function DoughnutChart({ data, options, className }: DoughnutChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataset = data.datasets[0];
  if (!dataset) return null;

  const values = dataset.data;
  const total = values.reduce((sum, v) => sum + v, 0);

  const showLegend = options?.plugins?.legend?.display !== false;
  const showTooltip = options?.plugins?.tooltip?.enabled !== false;

  const cutoutStr = dataset.cutout ?? '50%';
  const cutoutPercent = parseFloat(cutoutStr) / 100;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = r * cutoutPercent;

  let currentAngle = -Math.PI / 2;

  const arcs = values.map((value, i) => {
    const sweepAngle = total > 0 ? (value / total) * 2 * Math.PI : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweepAngle;
    currentAngle = endAngle;
    return { startAngle, endAngle, value, i };
  });

  return (
    <div className={className}>
      <div style={{ position: 'relative' }}>
        <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
          {arcs.map(({ startAngle, endAngle, value, i }) => {
            const sweep = endAngle - startAngle;
            if (sweep <= 0) return null;
            return (
              <path
                key={i}
                d={arcPath(cx, cy, r, innerR, startAngle, endAngle)}
                fill={getColor(dataset.backgroundColor, i)}
                stroke="white"
                strokeWidth={dataset.borderWidth ?? 2}
                opacity={hoveredIndex !== null && hoveredIndex !== i ? 0.7 : 1}
                style={{ cursor: showTooltip ? 'pointer' : 'default', transition: 'opacity 0.15s' }}
                onMouseEnter={e => {
                  setHoveredIndex(i);
                  if (showTooltip) {
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      label: data.labels?.[i] ?? `항목 ${i + 1}`,
                      value,
                    });
                  }
                }}
                onMouseMove={e => {
                  if (showTooltip && tooltip) {
                    setTooltip(prev => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltip(null);
                }}
              />
            );
          })}
        </svg>
      </div>

      {showTooltip && tooltip && (
        <div
          style={{ position: 'fixed', left: tooltip.x + 12, top: tooltip.y - 28, zIndex: 1000, pointerEvents: 'none' }}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow"
        >
          {tooltip.label}: {tooltip.value}
        </div>
      )}

      {showLegend && data.labels && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {data.labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1 text-xs">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: getColor(dataset.backgroundColor, i) }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
