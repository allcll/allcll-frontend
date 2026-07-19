import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface IRadarChartProps {
  data: ChartData<'radar'>;
  options?: ChartOptions<'radar'>;
  className?: string;
}

function RadarChart({ data, options, className }: IRadarChartProps) {
  return <Radar data={data} options={options} className={className} />;
}

export default RadarChart;
