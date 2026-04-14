import { lazy, Suspense, ComponentType } from 'react';
import { DoughnutChartSkeleton } from '../skeletons/DoughnutChartSkeleton';
import { BarChartSkeleton } from '../skeletons/BarChartSkeleton';
import { RadarChartSkeleton } from '../skeletons/RadarChartSkeleton';
import { MixedChartSkeleton } from '../skeletons/MixedChartSkeleton';

interface SkeletonProps {
  className?: string;
  height?: number;
}

const createLazyChart = <T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  Skeleton: ComponentType<SkeletonProps>,
) => {
  const LazyComponent = lazy(importFn);
  return (props: T & SkeletonProps) => (
    <Suspense fallback={<Skeleton className={props.className} height={props.height} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export const DoughnutChart = createLazyChart(() => import('./DoughnutChart'), DoughnutChartSkeleton);
export const BarChart = createLazyChart(() => import('./BarChart'), BarChartSkeleton);
export const RadarChart = createLazyChart(() => import('./RadarChart'), RadarChartSkeleton);
export const MixedChart = createLazyChart(() => import('./MixedChart'), MixedChartSkeleton);
