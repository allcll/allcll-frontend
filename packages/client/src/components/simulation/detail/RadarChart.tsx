// import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Radar as RadarChartJS } from 'react-chartjs-2';
import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

// const data = {
//   labels: ['신청 버튼 클릭 속도', '총 소요 시간', '정확도', '캡차 인증 속도'],
//   datasets: [
//     {
//       label: '평균',
//       data: [60, 60, 60, 60],
//       backgroundColor: 'rgba(5, 223, 114, 0.2)', // bg-blue-500 with opacity
//       borderColor: 'rgba(5, 223, 114, 1)',
//       borderWidth: 2,
//       pointBackgroundColor: 'rgba(5, 223, 114, 1)',
//     },
//     {
//       label: '내 능력',
//       data: [85, 85, 85, 85],
//       backgroundColor: 'rgb(0, 122, 255, 0.2)', // bg-blue-500 with opacity
//       borderColor: 'rgba(0, 122, 255, 1)',
//       borderWidth: 2,
//       pointBackgroundColor: 'rgba(0, 122, 255, 1)',
//     },
//   ],
// };

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

function getDataset(result: ExtendedResultResponse) {
  const { user_ability } = result;
  const { searchBtnSpeed, totalSpeed, accuracy, captchaSpeed } = user_ability;
  const labels = ['신청 버튼 클릭 속도', '전체 속도', '정확도', '캡차 인증 속도'];
  const myData = [(2 - searchBtnSpeed) * 50, ((15 - totalSpeed) / 15) * 100, accuracy, ((7 - captchaSpeed) / 7) * 100];

  return {
    labels,
    datasets: [
      {
        label: '평균',
        data: [50, 50, 89.2, 50],
        backgroundColor: 'rgba(5, 223, 114, 0.2)', // bg-blue-500 with opacity
        borderColor: 'rgba(5, 223, 114, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(5, 223, 114, 1)',
      },
      {
        label: '내 능력',
        data: myData.map(item => Math.min(Math.max(item, 0), 100)),
        backgroundColor: 'rgb(0, 122, 255, 0.2)', // bg-blue-500 with opacity
        borderColor: 'rgba(0, 122, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0, 122, 255, 1)',
      },
    ],
  };
}

function RadarChart({ result }: { result: ExtendedResultResponse }) {
  const datasets = getDataset(result);
  const { searchBtnSpeed, totalSpeed, accuracy, captchaSpeed } = result.user_ability;

  return (
    <>
      {/* 레이더 차트 */}
      <div className="flex justify-center w-full h-90">
        <RadarChartJS data={datasets} options={options} />
      </div>

      {/* 능력 설명 박스 */}
      <div className="absolute bottom-6 right-6 bg-white shadow-lg rounded-lg px-4 py-3 text-sm text-gray-800">
        <div className="font-bold text-base mb-1">내 능력</div>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <span>• 신청 버튼 클릭 속도&nbsp;</span> <span>{searchBtnSpeed.toFixed(2)} sec</span>
          </li>
          <li className="flex justify-between">
            <span>• 총 소요 시간</span> <span>{totalSpeed.toFixed(2)} sec</span>
          </li>
          <li className="flex justify-between">
            <span>• 정확도</span> <span>{accuracy} %</span>
          </li>
          <li className="flex justify-between">
            <span>• 캡차 인증 속도</span> <span>{captchaSpeed.toFixed(2)} sec</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default RadarChart;
