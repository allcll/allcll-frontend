/**
 * 이 파일은 시뮬레이션 성능을 기반으로 점수와 순위를 계산하는 함수들을 포함합니다.
 * 사용자의 행동(속도, 정확도 등)을 통계적 모델(로그-정규분포)을 사용하여 평가하고, 0점에서 100점 사이의 점수로 변환합니다.
 * 이를 통해 사용자는 자신의 수강신청 능력을 객관적인 수치로 파악할 수 있습니다.
 *
 * @constant Distribution - 각 평가 항목(검색 버튼 속도, 정확도, 캡차 속도, 전체 속도)에 대한 로그-정규분포의 평균(mu)과 표준편차(sigma)를 정의합니다.
 * @function logNormalCDF - 로그-정규분포의 누적분포함수(CDF) 값을 계산합니다. 점수 계산의 핵심 통계 함수입니다.
 * @function getSpeedScore - 소요 시간을 기반으로 속도 점수를 계산합니다. 시간이 짧을수록 높은 점수를 받습니다.
 * @function getAccuracyScore - 정확도(0-100)를 기반으로 점수를 계산합니다.
 * @function getAccuracy - 전체 소요 시간과 불필요한 행동에 소요된 시간을 바탕으로 정확도를 계산합니다.
 * @function getSearchBtnSpeedRank - 검색 버튼 클릭 속도에 대한 순위(점수)를 계산합니다.
 * @function getCaptchaSpeedRank - 캡차 인증 속도에 대한 순위(점수)를 계산합니다.
 * @function getAccuracyRank - 정확도에 대한 순위(점수)를 계산합니다.
 * @function getTotalSpeedRank - 과목당 평균 소요 시간에 대한 순위(점수)를 계산합니다.
 */
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
