/**
 * 차트 컴포넌트 코드 스플리팅 진입점.
 *
 * React.lazy()를 사용해 chart.js 관련 코드를 별도 청크로 분리합니다.
 * Vite의 manualChunks 설정으로 chart.js + react-chartjs-2가 하나의 파일로 묶입니다.
 *
 * 사용 방법:
 *   import { LazyDoughnutChart, DoughnutChartSkeleton } from '@/shared/ui/charts';
 *
 *   <Suspense fallback={<DoughnutChartSkeleton className="..." />}>
 *     <LazyDoughnutChart data={...} options={...} />
 *   </Suspense>
 */
import { lazy } from 'react';

export const LazyDoughnutChart = lazy(() => import('./DoughnutChart'));
export const LazyBarChart = lazy(() => import('./BarChart'));
export const LazyRadarChart = lazy(() => import('./RadarChart'));
export const LazyMixedChart = lazy(() => import('./MixedChart'));

export { DoughnutChartSkeleton, BarChartSkeleton, RadarChartSkeleton, MixedChartSkeleton } from './ChartSkeleton';

// 타입 re-export (런타임 번들에 영향 없음)
export type { MixedChartProps, MixedChartType } from './MixedChart';
