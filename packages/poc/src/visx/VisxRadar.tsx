import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { RADAR_DATA } from '../data';

const width = 320;
const height = 320;
const cx = width / 2;
const cy = height / 2;
const radius = 120;
const levels = 5;

const angleSlice = (Math.PI * 2) / RADAR_DATA.labels.length;

const rScale = scaleLinear<number>({
  domain: [0, 100],
  range: [0, radius],
});

function toXY(value: number, index: number) {
  const angle = angleSlice * index - Math.PI / 2;
  const r = rScale(value);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function gridPolygon(level: number) {
  const r = (radius * level) / levels;
  return RADAR_DATA.labels
    .map((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');
}

export function VisxRadar() {
  return (
    <div>
      <svg width={width} height={height}>
        <Group>
          {/* Grid */}
          {Array.from({ length: levels }, (_, i) => (
            <polygon key={i} points={gridPolygon(i + 1)} fill="none" stroke="#e5e7eb" strokeWidth={1} />
          ))}

          {/* Angle lines */}
          {RADAR_DATA.labels.map((_, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + radius * Math.cos(angle)}
                y2={cy + radius * Math.sin(angle)}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
            );
          })}

          {/* Data polygons */}
          {RADAR_DATA.datasets.map((ds, di) => {
            const pts = ds.data.map((v, i) => {
              const { x, y } = toXY(v, i);
              return `${x},${y}`;
            });
            return <polygon key={di} points={pts.join(' ')} fill={ds.color} stroke={ds.borderColor} strokeWidth={2} />;
          })}

          {/* Point labels */}
          {RADAR_DATA.labels.map((label, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const labelR = radius + 22;
            const x = cx + labelR * Math.cos(angle);
            const y = cy + labelR * Math.sin(angle);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#4b5563">
                {label}
              </text>
            );
          })}
        </Group>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', fontSize: 12, marginTop: 4 }}>
        {RADAR_DATA.datasets.map(ds => (
          <div key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: ds.borderColor,
                display: 'inline-block',
              }}
            />
            <span>{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
