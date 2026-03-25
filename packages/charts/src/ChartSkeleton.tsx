/** 도넛/파이 차트 스켈레톤 */
export function DoughnutChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} aria-busy="true" aria-label="차트 로딩 중">
      <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: '100%', aspectRatio: '1' }} />
    </div>
  );
}

/** 막대 차트 스켈레톤 */
export function BarChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`w-full bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      style={{ aspectRatio: '16 / 9', minHeight: 120 }}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-2 h-full px-6 pb-6 pt-4">
        {[55, 80, 40, 65].map(h => (
          <div key={h} className="flex-1 bg-gray-300 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

/** 레이더 차트 스켈레톤 */
export function RadarChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} aria-busy="true" aria-label="차트 로딩 중">
      <div
        className="bg-gray-200 animate-pulse"
        style={{ width: '100%', aspectRatio: '1', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
      />
    </div>
  );
}

export interface MixedChartSkeletonProps {
  className?: string;
  height?: number;
}

/** 혼합(bar+line) 차트 스켈레톤 */
export function MixedChartSkeleton({ className, height = 384 }: MixedChartSkeletonProps) {
  return (
    <div
      className={`w-full bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      style={{ height }}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-1 h-full px-12 pb-12 pt-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex-1 bg-gray-300 rounded-t" style={{ height: `${25 + (i % 4) * 18}%` }} />
        ))}
      </div>
    </div>
  );
}
