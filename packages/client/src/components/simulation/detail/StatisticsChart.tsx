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
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ExtendedResultResponse } from '@/pages/simulation/DashboardDetail.tsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticsChart({ result }: { result: ExtendedResultResponse }) {
  // 시뮬레이션 데이터 준비
  const simulations = result?.simulations || []; // 시뮬레이션 데이터 배열

  // 시뮬레이션 라벨 생성 (Sim 1, Sim 2, ...)
  const labels = simulations.map((_, index) => `시뮬레이션 ${index + 1}`);

  // 각 시뮬레이션의 시간 데이터 추출
  const captchaTimes = simulations.map(sim => sim.captchaTime || 0);
  const subjectTimes = simulations.map(sim => sim.subjectTime || 0);
  const searchBtnTimes = simulations.map(sim => sim.searchBtnTime || 0);
  const otherTimes = simulations.map(sim => sim.otherTime || 0);

  // 누적 값 계산 (선 그래프 데이터용)
  const captchaLineTimes = [...captchaTimes]; // 첫번째 경계선은 캡차 시간만

  const subjectLineTimes = captchaTimes.map((captchaTime, i) => captchaTime + subjectTimes[i]); // 두번째 경계선은 캡차 + 과목 신청

  const searchBtnLineTimes = subjectLineTimes.map((subjectTime, i) => subjectTime + searchBtnTimes[i]); // 세번째 경계선은 캡차 + 과목 신청 + 검색 버튼

  const totalTimes = searchBtnLineTimes.map((searchBtnTime, i) => searchBtnTime + otherTimes[i]); // 전체 시간

  const data = {
    labels,
    datasets: [
      // 누적 막대 차트 데이터셋
      {
        type: 'bar',
        label: '캡차 인증 속도',
        data: captchaTimes,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '과목 신청 시간',
        data: subjectTimes,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '검색 버튼 시간',
        data: searchBtnTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        stack: 'Stack 0',
      },
      {
        type: 'bar',
        label: '나머지 시간',
        data: otherTimes,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        stack: 'Stack 0',
      },

      // 경계선 그래프
      {
        type: 'line',
        label: '캡차 완료',
        data: captchaLineTimes,
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
        data: subjectLineTimes,
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        tension: 0.1,
      },
      {
        type: 'line',
        label: '검색 완료',
        data: searchBtnLineTimes,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '시뮬레이션별 시간 분포',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}초`;
          },
        },
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
          callback: function (value) {
            return value.toFixed(1) + '초';
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4">
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}

export default StatisticsChart;
