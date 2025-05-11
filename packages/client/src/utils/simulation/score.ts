function logNormalCDF(x: number, mu: number, sigma: number): number {
  if (x <= 0) return 0;

  const z = (Math.log(x) - Math.log(mu)) / sigma;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return z > 0 ? 1 - prob : prob;
}

/**
 * Speed Score 계산
 * @param takenTime {number} 과목 당 소요 시간 평균 (초)
 * @param tMin {number?} 과목 당 예상 최소 시간 (초)
 * @param tMax {number?} 과목당 예상 최대 시간 (초)
 * @param mu {number?} 정규 분포 평균
 * @param sigma {number?} 정규 분포 표준편차
 */
export function getSpeedScore(takenTime: number, tMin = 3.0, tMax = 7.5, mu = 4.6, sigma = 0.16): number {
  // 경계 제한
  const time = Math.min(Math.max(takenTime, tMin), tMax);
  const cdf = logNormalCDF(time, mu, sigma);
  const reversedScore = 1 - cdf;
  return reversedScore * 100;
}

export function getAccuracyScore(accuracy: number): number {
  const MAX_SCORE = 5;

  const score = Math.min(Math.max(accuracy, 0), 100) / 100;
  const cdf = logNormalCDF(score, 0.4, 0.1);
  const reversedScore = -cdf;

  return Math.round(reversedScore * MAX_SCORE);
}

/** 정확도 계산
 * @param takenTime 전체 소요 시간
 * @param canceledTime SUCCESS, FAILED 걸린 시간
 */
export function getAccuracy(takenTime: number, canceledTime: number): number {
  const accuracy = (takenTime - 2 * canceledTime) / takenTime;
  return Math.max(0, Math.round(accuracy * 100));
}

// // 사용 예시
// console.log('Speed Score Calculation Example');
// const exampleTimes = [2.5, 3.0, 4.0, 4.1, 4.6, 5, 6.0, 7.5, 8.0];
// exampleTimes.forEach(t => {
//   console.log(`Time: ${t}s -> Score: ${getSpeedScore(t)}`);
// });
