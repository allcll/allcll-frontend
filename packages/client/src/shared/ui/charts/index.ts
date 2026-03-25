/**
 * 차트 컴포넌트 코드 스플리팅 진입점.
 *
 * React.lazy를 사용해 각 차트를 별도 청크로 분리합니다.
 * 사용처에서는 <Suspense fallback={<ChartSkeleton />}>으로 감싸야 합니다.
 *
 * 예시:
 *   import { LazyDoughnutChart } from '@/shared/ui/charts';
 *   import { DoughnutChartSkeleton } from '@/shared/ui/charts';
 *
 *   <Suspense fallback={<DoughnutChartSkeleton className="..." />}>
 *     <LazyDoughnutChart data={...} />
 *   </Suspense>
 */
import { lazy } from 'react';

export const LazyDoughnutChart = lazy(() => import('./DoughnutChart').then(m => ({ default: m.DoughnutChart })));

export const LazyBarChart = lazy(() => import('./BarChart').then(m => ({ default: m.BarChart })));

export const LazyMixedChart = lazy(() => import('./MixedChart').then(m => ({ default: m.MixedChart })));

export const LazyRadarChart = lazy(() => import('./RadarChart').then(m => ({ default: m.RadarChart })));

// 타입 re-export (스플리팅과 무관하게 트리 쉐이킹 가능)
export type { DoughnutChartData, DoughnutChartOptions, DoughnutDataset } from './DoughnutChart';
export type { BarChartData, BarDataset } from './BarChart';
export type { MixedChartData, MixedChartOptions, MixedDataset } from './MixedChart';
export type { RadarChartData, RadarChartOptions, RadarDataset } from './RadarChart';
export { DoughnutChartSkeleton, BarChartSkeleton, MixedChartSkeleton, RadarChartSkeleton } from './ChartSkeleton';
