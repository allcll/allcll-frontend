/**
 * 극좌표(중심, 반지름, 각도)를 데카르트 좌표(x, y)로 변환합니다.
 *
 * @param cx - SVG 중심 x 좌표
 * @param cy - SVG 중심 y 좌표
 * @param r  - 반지름
 * @param angle - 라디안 각도 (0 = 오른쪽 방향)
 */
export function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/**
 * 도넛/파이 슬라이스 하나의 SVG path 문자열을 생성합니다.
 * 슬라이스는 outer arc → inner arc를 연결하는 환형(annular) 영역입니다.
 *
 * @param cx       - 중심 x
 * @param cy       - 중심 y
 * @param r        - 바깥쪽 반지름
 * @param innerR   - 안쪽 반지름 (0이면 파이 차트)
 * @param startAngle - 시작 각도 (라디안)
 * @param endAngle   - 끝 각도 (라디안)
 */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = polarToCartesian(cx, cy, r, startAngle);
  const outerEnd = polarToCartesian(cx, cy, r, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

/**
 * 도(°)를 라디안으로 변환합니다.
 */
export function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
