/**
 * 색상 배열 또는 단일 색상 문자열에서 인덱스에 해당하는 색상을 반환합니다.
 *
 * @param backgroundColor - 단일 색상 문자열, 색상 배열, 또는 undefined
 * @param i - 슬라이스/막대 인덱스
 * @returns CSS 색상 문자열
 *
 * @example
 * getSliceColor(['#f00', '#0f0', '#00f'], 1) // → '#0f0'
 * getSliceColor('#60a5fa', 0)               // → '#60a5fa'
 * getSliceColor(undefined, 0)              // → '#ccc'
 */
export function getSliceColor(backgroundColor: string | string[] | undefined, i: number): string {
  if (!backgroundColor) return '#ccc';
  return Array.isArray(backgroundColor) ? (backgroundColor[i % backgroundColor.length] ?? '#ccc') : backgroundColor;
}
