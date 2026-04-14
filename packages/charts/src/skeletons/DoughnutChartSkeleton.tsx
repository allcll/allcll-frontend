export function DoughnutChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} aria-busy="true" aria-label="차트 로딩 중">
      <div className="rounded-full bg-gray-200 animate-pulse" style={{ width: '100%', aspectRatio: '1' }} />
    </div>
  );
}
