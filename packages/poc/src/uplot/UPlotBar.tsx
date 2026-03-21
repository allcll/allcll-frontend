import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';
import { BAR_DATA } from '../data';

// uplot은 시계열/연속 데이터에 최적화된 canvas 기반 차트 라이브러리입니다.
// 카테고리별 막대 차트를 uplot으로 구현하려면 x축에 인덱스를 사용합니다.

const data: uPlot.AlignedData = [
  [0, 1, 2, 3], // x: 인덱스 (카테고리)
  BAR_DATA.values, // y: 값
];

const opts: uPlot.Options = {
  width: 320,
  height: 220,
  title: '',
  legend: { show: false },
  series: [
    {},
    {
      label: '관심도',
      fill: '#60a5fa',
      stroke: '#3b82f6',
      points: { show: false },
      paths: (u, seriesIdx, idx0, idx1) => {
        // uplot에서 막대 차트 렌더링
        const ctx = u.ctx;
        ctx.save();

        const [iMin, iMax] = [idx0, idx1];
        const xs = u.data[0] as number[];
        const ys = u.data[seriesIdx] as number[];
        const barW = Math.round((u.bbox.width / xs.length) * 0.5);

        ctx.fillStyle = '#60a5fa';

        for (let i = iMin; i <= iMax; i++) {
          const x = Math.round(u.valToPos(xs[i]!, 'x', true));
          const y = Math.round(u.valToPos(ys[i]!, 'y', true));
          const h = u.bbox.top + u.bbox.height - y;
          ctx.fillRect(x - barW / 2, y, barW, h);
        }

        ctx.restore();
        return null;
      },
    },
  ],
  axes: [
    {
      values: (_u, vals) => vals.map(v => BAR_DATA.labels[v as number] ?? ''),
    },
    {},
  ],
  scales: {
    x: { time: false },
    y: { range: [0, 60] },
  },
};

export function UPlotBar() {
  return (
    <div>
      <UplotReact options={opts} data={data} />
    </div>
  );
}
