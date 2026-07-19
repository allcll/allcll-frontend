import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface IDoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  className?: string;
}

function DoughnutChart({ data, options, className }: IDoughnutChartProps) {
  return <Doughnut data={data} options={options} className={className} />;
}

export default DoughnutChart;
