import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { colors } from '@allcll/allcll-ui';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressDoughnutProps {
  /** 이수 학점 */
  earned: number;
  /** 필요 학점 */
  required: number;
  /** 차트 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 가운데 퍼센트 표시 여부 */
  showPercentage?: boolean;
}

function ProgressDoughnut({ earned, required, size = 'medium', showPercentage = true }: ProgressDoughnutProps) {
  const percentage = required === 0 ? 100 : Math.round((earned / required) * 100);
  const remaining = Math.max(0, required - earned);

  const sizeConfig = {
    small: { width: 100, height: 100, fontSize: 'text-lg' },
    medium: { width: 140, height: 140, fontSize: 'text-2xl' },
    large: { width: 180, height: 180, fontSize: 'text-3xl' },
  };

  const config = sizeConfig[size];

  const data = {
    datasets: [
      {
        data: [earned, remaining],
        backgroundColor: [colors.primary[500], '#E5E7EB'],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: config.width, height: config.height }}>
      <Doughnut data={data} options={options} />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${config.fontSize} font-bold text-primary-500`}>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

export default ProgressDoughnut;
