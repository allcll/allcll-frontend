/** min 이상 max 미만의 난수를 반환합니다. */
export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min); // NOSONAR
}
