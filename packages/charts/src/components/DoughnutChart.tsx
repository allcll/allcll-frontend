import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  className?: string;
}

function DoughnutChart({ data, options, className }: DoughnutChartProps) {
  return <Doughnut data={data} options={options} className={className} />;
}

export default DoughnutChart;
