import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { BAR_DATA } from '../data';

const width = 320;
const height = 220;
const margin = { top: 10, right: 10, bottom: 36, left: 36 };

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const xScale = scaleBand<string>({
  domain: BAR_DATA.labels,
  range: [0, innerWidth],
  padding: 0.3,
});

const yMax = Math.max(...BAR_DATA.values);
const yScale = scaleLinear<number>({
  domain: [0, yMax * 1.1],
  range: [innerHeight, 0],
});

export function VisxBar() {
  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {BAR_DATA.labels.map(label => {
          const x = xScale(label) ?? 0;
          const value = BAR_DATA.values[BAR_DATA.labels.indexOf(label)] ?? 0;
          const barHeight = innerHeight - (yScale(value) ?? 0);
          const barY = innerHeight - barHeight;
          return <Bar key={label} x={x} y={barY} height={barHeight} width={xScale.bandwidth()} fill={BAR_DATA.color} />;
        })}
        <AxisLeft scale={yScale} numTicks={5} />
        <AxisBottom top={innerHeight} scale={xScale} />
      </Group>
    </svg>
  );
}
