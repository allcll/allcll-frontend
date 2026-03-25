/**
 * chart.js / react-chartjs-2 기반 막대 차트 래퍼.
 * 이 파일은 React.lazy()로 동적 임포트되어 별도 청크로 분리됩니다.
 */
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

interface BarChartProps {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  className?: string;
}

function BarChart({ data, options, className }: BarChartProps) {
  return <Bar data={data} options={options} className={className} />;
}

export default BarChart;
