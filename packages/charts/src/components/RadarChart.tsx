import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js/auto';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface RadarChartProps {
  data: ChartData<'radar'>;
  options?: ChartOptions<'radar'>;
  className?: string;
}

function RadarChart({ data, options, className }: RadarChartProps) {
  return <Radar data={data} options={options} className={className} />;
}

export default RadarChart;
