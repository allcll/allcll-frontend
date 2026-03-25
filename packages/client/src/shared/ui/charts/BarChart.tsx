import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';

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

const CHART_WIDTH = 320;
const CHART_HEIGHT = 220;
const DEFAULT_BAR_COLOR = '#60a5fa';
const margin = { top: 10, right: 10, bottom: 36, left: 40 };

function getColor(backgroundColor: string | string[], i: number): string {
  return Array.isArray(backgroundColor) ? (backgroundColor[i] ?? DEFAULT_BAR_COLOR) : backgroundColor;
}

export function BarChart({ data, className }: BarChartProps) {
  const dataset = data.datasets[0];
  if (!dataset) return null;

  const innerWidth = CHART_WIDTH - margin.left - margin.right;
  const innerHeight = CHART_HEIGHT - margin.top - margin.bottom;

  const xScale = scaleBand<string>({
    domain: data.labels,
    range: [0, innerWidth],
    padding: 0.3,
  });

  const yMax = Math.max(...dataset.data, 0);
  const yScale = scaleLinear<number>({
    domain: [0, yMax * 1.1],
    range: [innerHeight, 0],
    nice: true,
  });

  return (
    <svg width={CHART_WIDTH} height={CHART_HEIGHT} className={className} role="img" aria-label="막대 차트">
      <title>막대 차트</title>
      <Group left={margin.left} top={margin.top}>
        {data.labels.map((label, i) => {
          const x = xScale(label) ?? 0;
          const value = dataset.data[i] ?? 0;
          const barH = Math.max(innerHeight - (yScale(value) ?? 0), 0);
          return (
            <Bar
              key={label}
              x={x}
              y={innerHeight - barH}
              height={barH}
              width={xScale.bandwidth()}
              fill={getColor(dataset.backgroundColor, i)}
            />
          );
        })}
        <AxisLeft scale={yScale} numTicks={5} />
        <AxisBottom top={innerHeight} scale={xScale} />
      </Group>
    </svg>
  );
}
