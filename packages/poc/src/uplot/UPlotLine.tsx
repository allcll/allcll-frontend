import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
import { RADAR_DATA } from '../data';

// uplot은 시계열/라인 차트에 가장 적합합니다.
// 레이더 차트는 uplot이 기본 지원하지 않으므로, 유사한 라인 차트로 대체합니다.
// 각 지표를 x축에 놓고 두 시리즈(평균/내 능력)를 겹쳐 표시합니다.

const xData = [0, 1, 2, 3];

const opts: uPlot.Options = {
  width: 320,
  height: 220,
  title: '능력 비교 (라인 차트)',
  legend: { show: true },
  series: [
    {},
    {
      label: '평균',
      stroke: 'rgba(5, 223, 114, 1)',
      fill: 'rgba(5, 223, 114, 0.2)',
      width: 2,
    },
    {
      label: '내 능력',
      stroke: 'rgba(0, 122, 255, 1)',
      fill: 'rgba(0, 122, 255, 0.15)',
      width: 2,
    },
  ],
  axes: [
    {
      values: (_u, vals) => vals.map(v => RADAR_DATA.labels[v as number] ?? ''),
    },
    {
      label: '점수',
    },
  ],
  scales: {
    x: { time: false },
    y: { range: [0, 100] },
  },
};

const data: uPlot.AlignedData = [xData, RADAR_DATA.datasets[0]!.data, RADAR_DATA.datasets[1]!.data];

export function UPlotLine() {
  return (
    <div>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
        ※ uplot은 레이더 차트를 기본 지원하지 않아 라인 차트로 대체합니다.
      </p>
      <UplotReact options={opts} data={data} />
    </div>
  );
}
