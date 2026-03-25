/**
 * chart.js / react-chartjs-2 기반 레이더 차트 래퍼.
 * 이 파일은 React.lazy()로 동적 임포트되어 별도 청크로 분리됩니다.
 */
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

interface RadarChartProps {
  data: ChartData<'radar'>;
  options?: ChartOptions<'radar'>;
  className?: string;
}

function RadarChart({ data, options, className }: RadarChartProps) {
  return <Radar data={data} options={options} className={className} />;
}

export default RadarChart;
