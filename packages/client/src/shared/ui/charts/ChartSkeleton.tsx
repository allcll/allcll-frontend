/**
 * 차트 로딩 중에 표시되는 스켈레톤 컴포넌트.
 * 레이아웃 이동(CLS)을 방지하기 위해 실제 차트와 동일한 크기를 유지합니다.
 */

interface ChartSkeletonProps {
  className?: string;
}

/** 도넛/파이 차트 스켈레톤 (200×200) */
export function DoughnutChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div className={className} aria-busy="true" aria-label="차트 로딩 중">
      <div style={{ width: 200, height: 200 }} className="rounded-full bg-gray-200 animate-pulse mx-auto" />
    </div>
  );
}

/** 막대 차트 스켈레톤 (320×220) */
export function BarChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div
      style={{ width: 320, height: 220 }}
      className={`bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-3 h-full px-10 pb-8 pt-3">
        {[60, 90, 45, 75].map(h => (
          <div key={h} className="flex-1 bg-gray-300 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

interface MixedChartSkeletonProps extends ChartSkeletonProps {
  height?: number;
}

/** 혼합(막대+선) 차트 스켈레톤 */
export function MixedChartSkeleton({ className, height = 320 }: MixedChartSkeletonProps) {
  return (
    <div
      style={{ height }}
      className={`w-full bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-1 h-full px-14 pb-14 pt-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex-1 bg-gray-300 rounded-t" style={{ height: `${30 + (i % 3) * 20}%` }} />
        ))}
      </div>
    </div>
  );
}

/** 레이더 차트 스켈레톤 */
export function RadarChartSkeleton({ className }: ChartSkeletonProps) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} aria-busy="true" aria-label="차트 로딩 중">
      <div
        className="rounded-full bg-gray-200 animate-pulse"
        style={{ width: '100%', maxWidth: 300, aspectRatio: '1' }}
      />
    </div>
  );
}
