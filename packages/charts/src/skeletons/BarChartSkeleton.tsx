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
