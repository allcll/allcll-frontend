import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
import { colors } from '@allcll/allcll-ui';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressDoughnutProps {
  earned: number;
  required: number;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
}

function ProgressDoughnut({
  earned,
  required,
  size = 'medium',
  showPercentage = true,
}: Readonly<ProgressDoughnutProps>) {
  // 기준이 0 이면 비율을 말할 수 없다. 100% 로 채우면 요건이 없는데 다 채운 것처럼 보인다.
  const hasTarget = required > 0;
  const percentage = hasTarget ? Math.min(100, Math.round((earned / required) * 100)) : null;
  const remaining = Math.max(0, required - earned);
  const earnedForChart = Math.min(earned, required);

  const sizeMap = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
  };

  const textSizeMap = {
    small: 'text-base',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  const data = {
    labels: ['이수', '미이수'],
    datasets: [
      {
        data: hasTarget ? [earnedForChart, remaining] : [0, 1],
        backgroundColor: [colors.primary[500], '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className={`relative ${sizeMap[size]}`}>
      <Doughnut data={data} options={options} />
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSizeMap[size]} ${hasTarget ? 'text-primary-500' : 'text-gray-400'}`}>
            {hasTarget ? `${percentage}%` : '-'}
          </span>
        </div>
      )}
    </div>
  );
}

export default ProgressDoughnut;
