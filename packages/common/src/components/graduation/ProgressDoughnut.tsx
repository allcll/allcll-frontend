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
  const percentage = required === 0 ? 100 : Math.min(100, Math.round((earned / required) * 100));
  const remaining = Math.max(0, required - earned);
  const earnedForChart = Math.min(earned, required);

  const sizeMap = {
    small: 'w-20 h-20',
    medium: 'w-28 h-28',
    large: 'w-36 h-36',
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
        data: [earnedForChart, remaining],
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
          <span className={`font-bold ${textSizeMap[size]} text-primary-500`}>{percentage}%</span>
        </div>
      )}
    </div>
  );
}

export default ProgressDoughnut;
