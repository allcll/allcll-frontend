/**
 * 관심과목 필요한 기능
 * - 관심과목 리스트 Read
 * - 관심과목을 Create 기능
 * - 관심과목을 Delete 기능
 * - 최근 관심과목 스냅샷 Read
 * - 관심과목에 대한 새로운 스냅샷 Create(저장) 기능
 *
 * 시뮬레이션 필요한 기능
 * - 시뮬레이션 Create(시작) 기능
 * - 시뮬레이션 종료 + 결과 Update(저장) 기능
 * - 버튼 클릭시 이벤트 Create 기능 (ENUM 필요)
 *
 * 대시보드 필요한 기능
 * - 시뮬레이션 리스트 Read
 * - 시뮬레이션 결과 능력치 Read
 * - 시뮬레이션 과목별 타임라인 Read
 * - 시뮬레이션 과목별 결과 Read
 * */

// export type IndexDBGet<T extends Array<any>, V> = (...args: T) => IndexDBQuery<V>;
// export type IndexDBSet<T extends Array<any>, V> = (...args: T) => IndexDBMutation<V>;

export interface IndexDBQuery<T> {
  data: T|null;
  isPending: boolean;
  isError: boolean;
}

export interface IndexDBMutation<T> {
  mutate: (data: T) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * 시뮬레이션을 시작합니다.
 * @returns 시작 함수를 제공합니다.
 */
export function useSimulationStart() {
  const startSimulation = async () => {
    // API 요청 등을 통해 시뮬레이션 시작
  };
  return { startSimulation };
}

/**
 * 시뮬레이션을 종료하고 결과를 업데이트합니다.
 * @returns 종료 함수를 제공합니다.
 */
export function useSimulationEnd() {
  const endSimulation = async () => {
    // API 요청 등을 통해 시뮬레이션 종료 및 결과 저장
  };
  return { endSimulation };
}

/**
 * 버튼 클릭 시 이벤트를 생성합니다.
 * @param eventType 이벤트 타입입니다.
 * @returns 이벤트 생성 함수를 제공합니다.
 */
export function useButtonEvent() {
  const createButtonEvent = async () => {
    // ENUM 등을 통해 이벤트 생성
  };
  return { createButtonEvent };
}

/**
 * 시뮬레이션 리스트를 불러옵니다.
 * @returns 시뮬레이션 목록과 로딩 함수를 제공합니다.
 */
export function useDashboardList() {
  const loadSimulations = async () => {
    // API 요청 등을 통해 시뮬레이션 리스트 읽기
  };
  return { loadSimulations };
}

/**
 * 시뮬레이션 결과를 불러옵니다.
 * @returns 결과 및 로딩 함수를 제공합니다.
 */
export function useDashboardResults() {
  const loadResults = async () => {
    // API 요청 등을 통해 시뮬레이션 결과 읽기
  };
  return { loadResults };
}