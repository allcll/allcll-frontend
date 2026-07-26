const SKELETON_BAR_MIN_HEIGHT = 120;
const SKELETON_BAR_HEIGHTS = [55, 80, 40, 65];

export interface IBarChartSkeletonProps {
  className?: string;
  height?: number;
}

export function BarChartSkeleton({ className, height }: IBarChartSkeletonProps) {
  return (
    <div
      className={`w-full bg-gray-100 animate-pulse rounded ${className ?? ''}`}
      style={{ aspectRatio: '16 / 9', minHeight: SKELETON_BAR_MIN_HEIGHT, height }}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div className="flex items-end gap-2 h-full px-6 pb-6 pt-4">
        {SKELETON_BAR_HEIGHTS.map(barHeight => (
          <div key={barHeight} className="flex-1 bg-gray-300 rounded-t" style={{ height: `${barHeight}%` }} />
        ))}
      </div>
    </div>
  );
}
