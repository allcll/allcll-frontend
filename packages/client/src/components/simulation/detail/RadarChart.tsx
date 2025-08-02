// import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js/auto';
import { Radar as RadarChartJS } from 'react-chartjs-2';
import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';
import {
  getSearchBtnSpeedRank,
  getTotalSpeedRank,
  getAccuracyRank,
  getCaptchaSpeedRank,
} from '@/utils/simulation/score.ts';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

const options = {
  responsive: true,
  scales: {
    r: {
      angleLines: { display: true },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: {
        display: false,
      },
      pointLabels: {
        font: {
          size: 14,
        },
        color: '#4B5563', // text-gray-700
      },
      grid: {
        color: '#E5E7EB', // border-gray-300
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
    },
  },
};

function getDataset(result: IRadarChart['result']) {
  const { user_ability } = result;
  const { searchBtnSpeed, totalSpeed, accuracy, captchaSpeed } = user_ability;
  const labels = ['신청 버튼 클릭 속도', '전체 속도', '정확도', '매크로 인증 속도'];
  const myData = [searchBtnSpeed, totalSpeed, accuracy, captchaSpeed];

  return {
    labels,
    datasets: [
      {
        label: '평균',
        data: getRankArr([1.776296, 9.30268, 93.58, 3.843947]),
        backgroundColor: 'rgba(5, 223, 114, 0.2)', // bg-blue-500 with opacity
        borderColor: 'rgba(5, 223, 114, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(5, 223, 114, 1)',
      },
      {
        label: '내 능력',
        data: getRankArr(myData),
        backgroundColor: 'rgb(0, 122, 255, 0.2)', // bg-blue-500 with opacity
        borderColor: 'rgba(0, 122, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 122, 255, 1)',
      },
    ],
  };
}

function getRankArr(data: number[]) {
  return [
    getSearchBtnSpeedRank(data[0]),
    getTotalSpeedRank(data[1]),
    getAccuracyRank(data[2]),
    getCaptchaSpeedRank(data[3]),
  ];
}

interface IRadarChart {
  result: {
    user_ability: ExtendedResultResponse['user_ability'];
  };
}

function RadarChart({ result }: IRadarChart) {
  const datasets = getDataset(result);
  const { searchBtnSpeed, totalSpeed, accuracy, captchaSpeed } = result.user_ability;

  return (
    <>
      {/* 레이더 차트 */}
      <div className="flex justify-center w-full h-90">
        <RadarChartJS data={datasets} options={options} />
      </div>

      {/* 능력 설명 박스 */}
      <div className="absolute bottom-6 right-6 bg-white shadow-lg rounded-lg px-4 py-3 text-xs text-gray-800">
        <div className="font-bold text-sm mb-1">내 능력</div>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>• 신청 버튼 클릭 속도&nbsp;</span> <span>{searchBtnSpeed.toFixed(2)} sec</span>
          </li>
          <li className="flex justify-between">
            <span>• 총 소요 시간</span> <span>{totalSpeed.toFixed(2)} sec</span>
          </li>
          <li className="flex justify-between">
            <span>• 정확도</span> <span>{accuracy.toFixed(2)} %</span>
          </li>
          <li className="flex justify-between">
            <span>• 매크로 방지 코드 인증 속도</span> <span>{captchaSpeed.toFixed(2)} sec</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default RadarChart;
