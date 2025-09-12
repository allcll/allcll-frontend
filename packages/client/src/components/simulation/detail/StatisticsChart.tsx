import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  TooltipCallbacks,
} from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { useState } from 'react';
import { type AggregatedResultResponse } from '@/utils/simulation/ResultService';
import { isNumber } from 'chart.js/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
type ChartType = 'bar' | 'line';

// Fixme: type 정의 수정
function StatisticsChart({ result }: { result: AggregatedResultResponse }) {
  const [normalData, setNormalData] = useState(true);

  const simulations = !normalData
    ? result.simulations
    : result.simulations.filter(sim => sim.totalTime <= 80 && sim.searchBtnTime > 0);

  // 시뮬레이션 라벨 생성 (Sim 1, Sim 2, ...)
  const labels = simulations.map((_, index) => `시뮬레이션 ${index + 1}`);

  // 각 시뮬레이션의 시간 데이터 추출
  const searchBtnTimes = simulations.map(sim => sim.searchBtnTime);
  const captchaTimes = simulations.map(sim => sim.captchaTime - sim.searchBtnTime);
  const subjectTimes = simulations.map(sim => sim.subjectTime - sim.captchaTime);
  const totalTimes = simulations.map(sim => sim.totalTime - sim.subjectTime);

  const barThickness = simulations && simulations.length < 50 ? 16 : 8;

  const data: ChartData<ChartType> = {
    labels,
    datasets: [
      // 누적 막대 차트 데이터셋
      {
        type: 'bar',
        label: '검색 버튼 시간',
        data: searchBtnTimes,
        barThickness,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '매크로 방지 인증 속도',
        data: captchaTimes,
        barThickness,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '과목 신청 시간',
        data: subjectTimes,
        barThickness,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '나머지 시간',
        data: totalTimes,
        barThickness,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        stack: 'Stack 0',
      },

      // 경계선 그래프
      {
        type: 'line',
        label: '검색 완료',
        data: searchBtnTimes,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line',
        label: '매크로 완료',
        data: captchaTimes,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line',
        label: '과목 신청 완료',
        data: subjectTimes,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line',
        label: '총 소요 시간',
        data: totalTimes,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      // title: {
      //   display: true,
      //   text: '시뮬레이션별 시간 분포',
      //   font: { size: 16 },
      // },
      tooltip: {
        callbacks: {
          label: function (context: { dataset: { label: string }; parsed: { y: any } }) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}초`;
          },
        } as Partial<TooltipCallbacks<ChartType>>,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '시뮬레이션',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: '시간 (초)',
        },
        ticks: {
          callback: function (value: number | string) {
            return (isNumber(value) ? value.toFixed(1) : value) + '초';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4 box-border">
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div className="text-lg font-semibold">
          <input
            id="normal-data"
            type="checkbox"
            className="cursor-pointer"
            onChange={e => setNormalData(e.target.checked)}
            checked={normalData}
          />
          <label htmlFor="normal-data" className="text-sm pl-2 cursor-pointer">
            이상치 제거
          </label>
        </div>
      </div>
      <div className="h-full pb-6 overflow-x-auto">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}

// function getResultsData(result: AggregatedResultResponse) {
//   return result.simulations.map(sim => ({
//     captchaTime: sim.captchaTime || 0,
//     subjectTime: sim.subjectTime || 0,
//     searchBtnTime: sim.searchBtnTime || 0,
//     otherTime: sim.otherTime || 0,
//   }));
// }

export default StatisticsChart;
