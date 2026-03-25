/**
 * 차트 컴포넌트 코드 스플리팅 진입점.
 *
 * @allcll/charts 패키지를 React.lazy()로 동적 임포트하여
 * chart.js 관련 코드를 메인 번들에서 분리합니다.
 * Vite의 manualChunks 설정으로 chart.js + react-chartjs-2가
 * vendor-chartjs 단일 파일로 묶입니다.
 *
 * 사용 방법:
 *   import { LazyDoughnutChart, DoughnutChartSkeleton } from '@/shared/ui/charts';
 *
 *   <Suspense fallback={<DoughnutChartSkeleton className="..." />}>
 *     <LazyDoughnutChart data={...} options={...} />
 *   </Suspense>
 */
import { lazy } from 'react';

export const LazyDoughnutChart = lazy(() =>
  import('@allcll/charts').then(m => ({ default: m.DoughnutChart }))
);
export const LazyBarChart = lazy(() =>
  import('@allcll/charts').then(m => ({ default: m.BarChart }))
);
export const LazyRadarChart = lazy(() =>
  import('@allcll/charts').then(m => ({ default: m.RadarChart }))
);
export const LazyMixedChart = lazy(() =>
  import('@allcll/charts').then(m => ({ default: m.MixedChart }))
);

// 스켈레톤은 @allcll/charts에서 직접(정적) 임포트 — chart.js 없이 메인 번들에 포함
export { DoughnutChartSkeleton, BarChartSkeleton, RadarChartSkeleton, MixedChartSkeleton } from '@allcll/charts';

// 타입 re-export (런타임 번들에 영향 없음)
export type { MixedChartProps, MixedChartType } from '@allcll/charts';
