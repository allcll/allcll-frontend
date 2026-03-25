import { Suspense, useState } from 'react';
import { AggregatedResultResponse } from '@/features/simulation/lib/result.ts';
import { LazyMixedChart, MixedChartSkeleton } from '@/shared/ui/charts';
import type { MixedChartData, MixedChartOptions } from '@/shared/ui/charts';

// Fixme: type 정의 수정
function StatisticsChart({ result }: { result: AggregatedResultResponse }) {
  const [normalData, setNormalData] = useState(true);

  const simulations = !normalData
    ? result.simulations
    : result.simulations.filter(sim => sim.totalTime <= 80 && sim.searchBtnTime > 0);

  const labels = simulations.map((_, index) => `시뮬레이션 ${index + 1}`);

  const searchBtnTimes = simulations.map(sim => sim.searchBtnTime);
  const captchaTimes = simulations.map(sim => sim.captchaTime - sim.searchBtnTime);
  const subjectTimes = simulations.map(sim => sim.subjectTime - sim.captchaTime);
  const totalTimes = simulations.map(sim => sim.totalTime - sim.subjectTime);

  const barThickness = simulations && simulations.length < 50 ? 16 : 8;

  const data: MixedChartData = {
    labels,
    datasets: [
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

  const options: MixedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}초`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: '시뮬레이션' } },
      y: {
        stacked: true,
        title: { display: true, text: '시간 (초)' },
        ticks: {
          callback: value => (typeof value === 'number' ? value.toFixed(1) : String(value)) + '초',
        },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4 box-border">
      <div className="flex justify-between items-center mb-4">
        <div />
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
        <Suspense fallback={<MixedChartSkeleton height={320} />}>
          <LazyMixedChart data={data} options={options} />
        </Suspense>
      </div>
    </div>
  );
}

export default StatisticsChart;
