import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export type MixedChartType = 'bar' | 'line';
export type MixedChartTooltipItem = TooltipItem<MixedChartType>;

export interface IMixedChartProps {
  data: ChartData<MixedChartType>;
  options?: ChartOptions<MixedChartType>;
  className?: string;
  height?: number | string;
}

function MixedChart({ data, options, className, height }: IMixedChartProps) {
  return <Chart type="bar" data={data} options={options} className={className} height={height} />;
}

export default MixedChart;
