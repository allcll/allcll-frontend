/**
 * chart.js / react-chartjs-2 기반 도넛 차트 래퍼.
 * 이 파일은 React.lazy()로 동적 임포트되어 별도 청크로 분리됩니다.
 */
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: ChartData<'doughnut'>;
  options?: ChartOptions<'doughnut'>;
  className?: string;
}

function DoughnutChart({ data, options, className }: DoughnutChartProps) {
  return <Doughnut data={data} options={options} className={className} />;
}

export default DoughnutChart;
