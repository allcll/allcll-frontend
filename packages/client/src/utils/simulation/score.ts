const Distribution = {
  searchBtnSpeed: { mu: 1.457, sigma: 0.7362 },
  accuracy: { mu: 100, sigma: 0.0017 },
  captchaSpeed: { mu: 3.6415, sigma: 0.4057 },
  totalSpeed: { mu: 8.6367, sigma: 0.5422 },
};

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
 * @param mu {number|undefined} 정규 분포 평균
 * @param sigma {number|undefined} 정규 분포 표준편차
 */
export function getSpeedScore(takenTime: number, mu = 7.5, sigma = 0.3): number {
  // 경계 제한
  const MIN_SCORE = 0;
  const MAX_SCORE = 100;

  const time = takenTime > 3000 ? takenTime / 1000 : takenTime; // sec / ms 자동 구분
  const cdf = logNormalCDF(time, mu, sigma);
  const reversedScore = 1 - cdf;
  return Math.max(Math.min(reversedScore * MAX_SCORE, MAX_SCORE), MIN_SCORE);
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
  const accuracy = (takenTime - 2 * canceledTime) / (takenTime - canceledTime);
  return Math.max(0, Math.round(accuracy * 100));
}

// // 사용 예시
// console.log('Speed Score Calculation Example');
// const exampleTimes = [2.5, 3.0, 4.0, 4.1, 4.6, 5, 6.0, 7.5, 8.0];
// exampleTimes.forEach(t => {
//   console.log(`Time: ${t}s -> Score: ${getSpeedScore(t)}`);
// });

/**
 * 검색 버튼 클릭 속도 랭크 계산
 * @param takenTime
 */
export function getSearchBtnSpeedRank(takenTime: number): number {
  return getSpeedScore(takenTime, Distribution.searchBtnSpeed.mu, Distribution.searchBtnSpeed.sigma);
}

/**
 * 캡차 인증 속도 랭크 계산
 * @param takenTime
 */
export function getCaptchaSpeedRank(takenTime: number): number {
  return getSpeedScore(takenTime, Distribution.captchaSpeed.mu, Distribution.captchaSpeed.sigma);
}

/**
 * Accuracy 랭크 계산
 * @param accuracy
 */
export function getAccuracyRank(accuracy: number): number {
  return Math.max(0, Math.min(accuracy, 100));
}

/**
 * 전체 소요 시간 / 과목 수 랭크 계산
 * @param takenTime
 */
export function getTotalSpeedRank(takenTime: number): number {
  return getSpeedScore(takenTime, Distribution.totalSpeed.mu, Distribution.totalSpeed.sigma);
}
