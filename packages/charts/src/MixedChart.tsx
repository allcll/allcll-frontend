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
} from 'chart.js/auto';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export type MixedChartType = 'bar' | 'line';

export interface MixedChartProps {
  data: ChartData<MixedChartType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>;
}

function MixedChart({ data, options }: MixedChartProps) {
  return <Chart type="bar" data={data} options={options} />;
}

export default MixedChart;
