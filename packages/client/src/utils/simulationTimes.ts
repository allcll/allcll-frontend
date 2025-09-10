/** 대기 모달 기다리는 사람 수 시뮬레이션 하는 함수 */
export function calculateBehindPeople(
  elapsedTime: number,
  clickTime: number,
  unit: number,
  initialBehindPeople: number,
  basePeoplePerUnit: number,
  baseProcessedPerUnit: number,
) {
  const totalUnits = Math.floor((elapsedTime + clickTime) / unit);
  let cumulativeIn = initialBehindPeople;
  let cumulativeProcessed = 0;

  for (let i = 0; i <= totalUnits; i++) {
    const currentTime = i * unit;
    let peoplePerUnit = basePeoplePerUnit;
    let processedPerUnit = baseProcessedPerUnit;

    if (currentTime > 4) {
      peoplePerUnit = 48;
      processedPerUnit = 33;
    }

    cumulativeIn += peoplePerUnit;
    cumulativeProcessed += processedPerUnit;
  }

  return Math.max(Math.round(cumulativeIn - cumulativeProcessed), 0);
}

/**
 * 주어진 시간, 사용자 수, 서버 처리량을 바탕으로 큐 대기 시간을 계산합니다.
 * @param {number} time 현재 시점 (초 단위)
 * @param {number?} totalUsers 총 사용자 수
 * @param {number?} throughput 서버 처리량 (초당 요청 수)
 * @returns {number} 현재 시점의 딜레이 시간 (초 단위)
 */
export function calculateQueueDelay(
  time: number,
  totalUsers: number | undefined = 1000,
  throughput: number | undefined = 300,
): number {
  // 클릭 시점별 평균 및 표준편차 (예시 값)
  const averages = [0.5, 4, 5, 7, 9];
  const initialStdDev = 3;
  const stdDevIncrement = Math.sqrt(2);

  // scipy.stats.norm.cdf와 유사한 기능 구현
  // 정규분포의 누적 분포 함수 (CDF)를 계산하는 보조 함수
  function normalCdf(x: number, mean: number, stdDev: number) {
    const erf = (z: number) => {
      // 오차 함수 (Error Function) 근사치
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      const sign = z >= 0 ? 1 : -1;
      z = Math.abs(z);

      const t = 1.0 / (1.0 + p * z);
      const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
      return sign * y;
    };

    return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
  }

  // 누적 도착 요청 수 계산
  let cumulativeArrivals = 0;
  for (let i = 0; i < averages.length; i++) {
    const avg = averages[i];
    const stdDev = initialStdDev + i * stdDevIncrement;
    cumulativeArrivals += normalCdf(time, avg, stdDev);
  }

  const totalArrivals = totalUsers * cumulativeArrivals;

  // 처리된 요청 수
  const departures = throughput * time;

  // 큐에 쌓인 요청 수
  const queueSize = Math.max(0, totalArrivals - departures);

  // 딜레이 시간 계산 (큐에 쌓인 요청 수를 처리량으로 나눔)

  return queueSize / throughput;
}

// // 사용 예시
// const currentTime = 5.0; // 현재 시점 (초)
// const numUsers = 1000;
// const serverThroughput = 300;
//
// const delayInSeconds = calculateQueueDelay(currentTime, numUsers, serverThroughput);
//
// console.log(`현재 시점 (${currentTime}초)의 예상 딜레이: ${delayInSeconds.toFixed(4)}초`);
//
// // 다른 시점에서의 딜레이 확인
// console.log(`1초 시점의 예상 딜레이: ${calculateQueueDelay(1, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`2초 시점의 예상 딜레이: ${calculateQueueDelay(2, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`3초 시점의 예상 딜레이: ${calculateQueueDelay(3, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`6초 시점의 예상 딜레이: ${calculateQueueDelay(6, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`8초 시점의 예상 딜레이: ${calculateQueueDelay(8, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`10초 시점의 예상 딜레이: ${calculateQueueDelay(10, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`15초 시점의 예상 딜레이: ${calculateQueueDelay(15, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`20초 시점의 예상 딜레이: ${calculateQueueDelay(20, numUsers, serverThroughput).toFixed(4)}초`);
// console.log(`30초 시점의 예상 딜레이: ${calculateQueueDelay(30, numUsers, serverThroughput).toFixed(4)}초`);
