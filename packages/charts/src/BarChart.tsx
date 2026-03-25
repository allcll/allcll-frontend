import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js/auto';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  className?: string;
}

function BarChart({ data, options, className }: BarChartProps) {
  return <Bar data={data} options={options} className={className} />;
}

export default BarChart;
