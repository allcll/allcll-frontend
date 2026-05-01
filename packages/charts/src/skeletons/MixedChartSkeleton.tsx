const SKELETON_MIXED_BAR_COUNT = 10;
const SKELETON_MIXED_HEIGHT_BASE = 25;
const SKELETON_MIXED_HEIGHT_STEP = 18;
const SKELETON_MIXED_HEIGHT_MODULO = 4;

export interface IMixedChartSkeletonProps {
  className?: string;
  height?: number;
}

export function MixedChartSkeleton({ className, height = 384 }: IMixedChartSkeletonProps) {
  return (
    <div
      className={`w-full bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      style={{ height }}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-1 h-full px-12 pb-12 pt-4">
        {Array.from({ length: SKELETON_MIXED_BAR_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-300 rounded-t"
            style={{
              height: `${SKELETON_MIXED_HEIGHT_BASE + (i % SKELETON_MIXED_HEIGHT_MODULO) * SKELETON_MIXED_HEIGHT_STEP}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
