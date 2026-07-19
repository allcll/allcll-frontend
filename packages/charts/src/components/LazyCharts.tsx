import { lazy, Suspense, type ComponentType } from 'react';
import { DoughnutChartSkeleton } from '../skeletons/DoughnutChartSkeleton';
import { BarChartSkeleton } from '../skeletons/BarChartSkeleton';
import { RadarChartSkeleton } from '../skeletons/RadarChartSkeleton';
import { MixedChartSkeleton } from '../skeletons/MixedChartSkeleton';

interface ISkeletonProps {
  className?: string;
  height?: number;
}

const createLazyChart = <T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  Skeleton: ComponentType<ISkeletonProps>,
  displayName: string,
) => {
  const LazyComponent = lazy(importFn);
  const ChartComponent = (props: T & ISkeletonProps) => (
    <Suspense fallback={<Skeleton className={props.className} height={props.height} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  ChartComponent.displayName = displayName;
  return ChartComponent;
};

export const DoughnutChart = createLazyChart(() => import('./DoughnutChart'), DoughnutChartSkeleton, 'DoughnutChart');
export const BarChart = createLazyChart(() => import('./BarChart'), BarChartSkeleton, 'BarChart');
export const RadarChart = createLazyChart(() => import('./RadarChart'), RadarChartSkeleton, 'RadarChart');
export const MixedChart = createLazyChart(() => import('./MixedChart'), MixedChartSkeleton, 'MixedChart');
