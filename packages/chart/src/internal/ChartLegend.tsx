/** 범례 항목 하나를 나타내는 데이터 */
export interface LegendItem {
  label: string;
  /** CSS 색상 문자열 */
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

/**
 * 차트 하단에 표시되는 색상 점 + 레이블 범례 컴포넌트.
 * DoughnutChart, RadarChart, MixedChart 가 공통으로 사용합니다.
 */
export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
