import { lazy, Suspense, ComponentType } from 'react';
import { DoughnutChartSkeleton } from '../skeletons/DoughnutChartSkeleton';
import { BarChartSkeleton } from '../skeletons/BarChartSkeleton';
import { RadarChartSkeleton } from '../skeletons/RadarChartSkeleton';
import { MixedChartSkeleton } from '../skeletons/MixedChartSkeleton';
import { type ChartData, type ChartOptions } from 'chart.js';

interface ChartProps {
  data: ChartData;
  options?: ChartOptions;
}

interface SkeletonProps {
  className?: string;
  height?: number;
}

const createLazyChart = <T extends SkeletonProps, U extends ChartProps>(
  importFn: () => Promise<{ default: ComponentType<U> }>,
  Skeleton: ComponentType<T>,
) => {
  const LazyComponent = lazy(importFn);
  return (props: T & U) => (
    <Suspense fallback={<Skeleton className={props.className} {...props} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const DoughnutChart = createLazyChart(() => import('./DoughnutChart'), DoughnutChartSkeleton);
export const BarChart = createLazyChart(() => import('./BarChart'), BarChartSkeleton);
export const RadarChart = createLazyChart(() => import('./RadarChart'), RadarChartSkeleton);
export const MixedChart = createLazyChart(() => import('./MixedChart'), MixedChartSkeleton);
