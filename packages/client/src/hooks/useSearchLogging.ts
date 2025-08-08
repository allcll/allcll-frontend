import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Searches {
  search: string;
  dprt_cd: number;
  target: number;
  created_at: number;
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const COMMIT_DELAY = 1.5 * 60 * 1000; // 이용자 페이지 사용시간 평균
const DELAY_CALC_THRESHOLD = 5; // 검색 로그 데이터가 5개 이상일 때 커밋 딜레이 계산
const SEARCH_LOGGING_KEY = 'searchLoggingData';
const SEARCH_LOGGING_TABLE = import.meta.env.VITE_SUPABASE_TABLE_NAME;

const Logging = {
  timer: null as NodeJS.Timeout | null,
  commitDelay: COMMIT_DELAY,
  data: [] as Searches[],
  loadLoggingData() {
    if (Logging.data.length > 0) return Logging.data;

    // 로컬 스토리지에서 검색 로그 데이터를 불러옵니다.
    const data = localStorage.getItem(SEARCH_LOGGING_KEY);
    if (data) Logging.data = JSON.parse(data);

    return Logging.data;
  },

  /** 검색 로그 데이터를 업데이트합니다. */
  updateLoggingData(searchTerm: string | undefined, dprtCode: string | undefined, subjectId: number) {
    const dprtCodeValue = !dprtCode || isNaN(Number(dprtCode)) ? -1 : Number(dprtCode);
    const term =
      searchTerm === undefined && Logging.data.length > 0
        ? Logging.data[Logging.data.length - 1].search
        : (searchTerm ?? '');

    const newData = { search: term, dprt_cd: dprtCodeValue, target: subjectId, created_at: Date.now() };

    /** 앞에 있는 요소를 업데이트 할 지 판단하는 함수 */
    const needUpdate = (nowData: Searches) => {
      if (Logging.data.length === 0) return false;

      const lastData = Logging.data[Logging.data.length - 1];
      return (
        lastData.target < 0 && (lastData.search.includes(nowData.search) || nowData.search.includes(lastData.search))
      );
    };

    // update logging data
    if (needUpdate(newData)) {
      const lastData = Logging.data[Logging.data.length - 1];
      lastData.target = subjectId;
      lastData.created_at = Date.now();

      // 현재 검색어가 더 긴 경우, 업데이트
      if (newData.search.includes(lastData.search)) {
        lastData.search = newData.search;
      }

      if (newData.dprt_cd >= 0) {
        lastData.dprt_cd = newData.dprt_cd;
      }
    } else {
      // new logging data
      Logging.data.push(newData);
    }

    localStorage.setItem(SEARCH_LOGGING_KEY, JSON.stringify(Logging.data));

    Logging.submitDelayCommit();
  },

  reconcileLoggingData() {
    // 의미 없는 데이터 => 기본 데이터 제거
    Logging.data = Logging.data.filter(item => !!item.search && item.dprt_cd < 0 && item.target < 0);

    // 검색 후, 선택되지 않은 데이터가 남아있는 것 방지
    Logging.data = Logging.data.filter((item, index) => {
      return !(
        index > 0 &&
        item.search === Logging.data[index - 1].search &&
        item.dprt_cd === Logging.data[index - 1].dprt_cd &&
        item.target === -1
      );
    });

    localStorage.setItem(SEARCH_LOGGING_KEY, JSON.stringify(Logging.data));
  },

  submitDelayCommit() {
    if (Logging.timer) {
      clearTimeout(Logging.timer);
      Logging.timer = null;
    }

    // 커밋 시간 업데이트
    if (Logging.data.length > DELAY_CALC_THRESHOLD) {
      // timestamp 간격 평균
      const timestamps = Logging.data.map(item => item.created_at);
      const intervals = timestamps.slice(1).map((time, index) => time - timestamps[index]);
      const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

      Logging.commitDelay = Math.max(COMMIT_DELAY, averageInterval + 10 * 1000);
    }

    // 타이머 설정
    Logging.timer = setTimeout(() => {
      Logging.timer = null;
      Logging.commitLoggingData();
    }, Logging.commitDelay);
  },

  commitLoggingData() {
    Logging.reconcileLoggingData();

    const length = Logging.data.length;
    if (length === 0) return;

    const result = Logging.data.map(({ search, dprt_cd, target }) => ({ search, dprt_cd, target }));

    supabase
      .from(SEARCH_LOGGING_TABLE)
      .insert(result)
      .then(({ error }) => {
        if (error) {
          console.error('Error committing search logging data:', error);
        } else {
          Logging.data = Logging.data.slice(length);
          localStorage.setItem(SEARCH_LOGGING_KEY, JSON.stringify(Logging.data));
        }
      });
  },
};

function useSearchLogging() {
  useEffect(() => {
    Logging.loadLoggingData();
  }, []);

  /** 검색이 완료되었을 때 또는 검색 중일 때 호출 */
  function onSearchChange(searchTerm: string | undefined, dprtCode?: string) {
    Logging.updateLoggingData(searchTerm, dprtCode, -1);
  }

  /** 검색에 대한 결과가 선택되었을 때 호출 */
  function selectTarget(searchTerm: string | undefined, dprtCode: string | undefined, subjectId: number) {
    Logging.updateLoggingData(searchTerm, dprtCode, subjectId);
  }

  /** 특정 대상을 선택했을 때, 검색어를 모를 때 호출 (이전 검색 데이터 이용함) */
  function selectTargetOnly(subjectId: number) {
    Logging.updateLoggingData(undefined, undefined, subjectId);
  }

  return { onSearchChange, selectTarget, selectTargetOnly };
}

export default useSearchLogging;
