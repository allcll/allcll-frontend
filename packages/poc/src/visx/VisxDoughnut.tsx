import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { DOUGHNUT_DATA } from '../data';

const width = 280;
const height = 280;
const cx = width / 2;
const cy = height / 2;
const outerRadius = 110;
const innerRadius = 66; // 도넛 형태

interface Slice {
  label: string;
  value: number;
  color: string;
}

const slices: Slice[] = DOUGHNUT_DATA.labels.map((label, i) => ({
  label,
  value: DOUGHNUT_DATA.values[i] ?? 0,
  color: DOUGHNUT_DATA.colors[i] ?? '#ccc',
}));

export function VisxDoughnut() {
  return (
    <div>
      <svg width={width} height={height}>
        <Group top={cy} left={cx}>
          <Pie
            data={slices}
            pieValue={d => d.value}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            cornerRadius={3}
            padAngle={0.01}
          >
            {pie =>
              pie.arcs.map(arc => (
                <g key={arc.data.label}>
                  <path d={pie.path(arc) ?? ''} fill={arc.data.color} stroke="white" strokeWidth={2} />
                </g>
              ))
            }
          </Pie>
        </Group>
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', fontSize: 12 }}>
        {slices.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: s.color, display: 'inline-block' }}
            />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
