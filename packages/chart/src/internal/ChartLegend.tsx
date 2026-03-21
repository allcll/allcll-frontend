/** 범례 항목 하나를 나타내는 데이터 */
export interface LegendItem {
  label: string;
  /** CSS 색상 문자열 */
  color: string;
}

interface ChartLegendProps {
  items: LegendItem[];
  /**
   * true 이면 범례 항목 클릭 시 해당 데이터셋을 토글할 수 있습니다.
   * options.plugins.legend.toggleable 과 연동됩니다.
   */
  toggleable?: boolean;
  /**
   * 현재 숨겨진 데이터셋의 인덱스 집합.
   * toggleable=true 일 때만 사용됩니다.
   */
  hiddenIndices?: ReadonlySet<number>;
  /** 범례 항목을 클릭했을 때 호출됩니다. */
  onToggle?: (index: number) => void;
}

/**
 * 차트 하단에 표시되는 색상 점 + 레이블 범례 컴포넌트.
 * DoughnutChart, RadarChart, MixedChart 가 공통으로 사용합니다.
 *
 * toggleable=true 시:
 * - 항목을 클릭하면 onToggle 이 호출됩니다.
 * - 숨겨진 항목은 취소선 + 흐리게 표시됩니다.
 */
export function ChartLegend({ items, toggleable, hiddenIndices, onToggle }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-2">
      {items.map((item, i) => {
        const hidden = hiddenIndices?.has(i) ?? false;
        return (
          <div
            key={i}
            className="flex items-center gap-1 text-xs"
            style={{
              cursor: toggleable ? 'pointer' : 'default',
              opacity: hidden ? 0.4 : 1,
              transition: 'opacity 0.15s',
              userSelect: 'none',
            }}
            onClick={toggleable ? () => onToggle?.(i) : undefined}
          >
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
            <span style={{ textDecoration: hidden ? 'line-through' : 'none' }}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
