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

export interface MixedChartProps {
  data: ChartData<MixedChartType>;
  options?: ChartOptions<MixedChartType>;
}

function MixedChart({ data, options }: MixedChartProps) {
  return <Chart type="bar" data={data} options={options} />;
}

export default MixedChart;
