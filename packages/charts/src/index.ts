/**
 * @allcll/charts
 *
 * chart.js / react-chartjs-2 기반 차트 컴포넌트 패키지.
 * 라이브러리가 변경되더라도 이 패키지만 수정하면 됩니다.
 *
 * 클라이언트에서는 React.lazy()로 이 패키지를 동적 임포트하여
 * 차트 관련 코드를 메인 번들에서 분리합니다.
 *
 * 사용 예시:
 *   const DoughnutChart = lazy(() =>
 *     import('@allcll/charts').then(m => ({ default: m.DoughnutChart }))
 *   );
 */
export { default as DoughnutChart } from './DoughnutChart';
export type { DoughnutChartProps } from './DoughnutChart';

export { default as BarChart } from './BarChart';
export type { BarChartProps } from './BarChart';

export { default as RadarChart } from './RadarChart';
export type { RadarChartProps } from './RadarChart';

export { default as MixedChart } from './MixedChart';
export type { MixedChartProps, MixedChartType } from './MixedChart';

export {
  DoughnutChartSkeleton,
  BarChartSkeleton,
  RadarChartSkeleton,
  MixedChartSkeleton,
} from './ChartSkeleton';
export type { MixedChartSkeletonProps } from './ChartSkeleton';
