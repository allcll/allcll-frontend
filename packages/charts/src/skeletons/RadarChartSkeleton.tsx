export interface IRadarChartSkeletonProps {
  className?: string;
  height?: number;
}

export function RadarChartSkeleton({ className, height }: IRadarChartSkeletonProps) {
  return (
    <div
      className={`flex items-center justify-center ${className ?? ''}`}
      style={{ height }}
      aria-busy="true"
      aria-label="차트 로딩 중"
    >
      <div
        className="bg-gray-200 animate-pulse"
        style={{ width: '100%', aspectRatio: '1', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
      />
    </div>
  );
}
