import { Pie } from '@visx/shape';
import { Group } from '@visx/group';

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
  width?: number;
  height?: number;
}

interface SliceData {
  value: number;
  color: string;
  label: string | undefined;
  index: number;
}

export function DoughnutChart({ data, options, className, width = 200, height = 200 }: DoughnutChartProps) {
  const dataset = data.datasets[0];
  if (!dataset) return null;

  const cx = width / 2;
  const cy = height / 2;

  const cutoutStr = dataset.cutout ?? '50%';
  const cutoutPercent = cutoutStr.includes('%') ? Number.parseFloat(cutoutStr) / 100 : Number.parseFloat(cutoutStr);
  const outerRadius = Math.min(width, height) / 2 - 4;
  const innerRadius = outerRadius * cutoutPercent;

  const showLegend = options?.plugins?.legend?.display !== false;

  const bgColors = Array.isArray(dataset.backgroundColor)
    ? dataset.backgroundColor
    : dataset.data.map(() => (dataset.backgroundColor as string) ?? '#ccc');

  const slices: SliceData[] = dataset.data.map((value, i) => ({
    value,
    color: bgColors[i] ?? '#ccc',
    label: data.labels?.[i],
    index: i,
  }));

  return (
    <div className={className}>
      <svg width={width} height={height} role="img" aria-label="도넛 차트">
        <title>도넛 차트</title>
        <Group top={cy} left={cx}>
          <Pie data={slices} pieValue={d => d.value} outerRadius={outerRadius} innerRadius={innerRadius} padAngle={0}>
            {({ arcs, path }) =>
              arcs.map(arc => (
                <path
                  key={arc.data.index}
                  d={path(arc) ?? ''}
                  fill={arc.data.color}
                  stroke="white"
                  strokeWidth={dataset.borderWidth ?? 0}
                />
              ))
            }
          </Pie>
        </Group>
      </svg>
      {showLegend && data.labels && (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {slices.map(s => (
            <div key={s.label ?? s.index} className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
