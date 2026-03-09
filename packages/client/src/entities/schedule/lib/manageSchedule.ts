export enum ServiceMode {
  WISHLIST = 'wishlist',
  REGISTRATION_SENIOR = 'registration-senior',
  REGISTRATION_ALL = 'registration-all',
  REGISTRATION_FRESHMAN = 'registration-freshman',
  CORRECTION = 'correction',
}

export interface ServicePeriod {
  start: string;
  end: string;
  mode: ServiceMode;
  description: string;
}

/**
 * periods: 수강 신청과 관련된 각 기간의 시작과 끝, 그리고 해당 기간의 모드와 설명
 * displayPeriod: 메인 배너의 수강 신청 기간
 * CURRENT_PERIOD의 start, end 필드는 매 학기  일정이 나오면 업데이트 되어야합니다.
 */
export interface AcademicSchedule {
  periods: ServicePeriod[];

  displayPeriod: {
    displayPeriodName?: string; // '수강 신청 기간' or '수강 정정 기간''
    start: string; // '02월 10일(화)'
    end: string; // '02월 13일(금)'
  };
}

export const CURRENT_PERIOD: AcademicSchedule = {
  periods: [
    {
      start: '2026-01-27T10:00:00',
      end: '2026-02-09T16:59:59',
      mode: ServiceMode.WISHLIST,
      description: '관심과목 담기 기간',
    },
    {
      start: '2026-02-10T10:00:00',
      end: '2026-02-12T16:59:59',
      mode: ServiceMode.REGISTRATION_SENIOR,
      description: '4~1학년 수강신청 기간',
    },
    {
      start: '2026-02-13T10:00:00',
      end: '2026-02-26T16:59:59',
      mode: ServiceMode.REGISTRATION_ALL,
      description: '전체학년 수강신청 기간',
    },
    {
      start: '2026-02-27T10:00:00',
      end: '2026-02-27T16:59:59',
      mode: ServiceMode.REGISTRATION_FRESHMAN,
      description: '신입생 수강신청 기간',
    },
    {
      start: '2026-03-04T10:00:00',
      end: '2026-03-09T16:59:59',
      mode: ServiceMode.CORRECTION,
      description: '수강정정 기간',
    },
  ],

  displayPeriod: {
    displayPeriodName: '수강정정 기간',
    start: '03월 04일(수)',
    end: '03월 09일(월)',
  },
};

//preSeat 데이터 업데이트 시 preSeatOpenDate를 변경해주어야합니다.
export const PRESEAT_OPEN_DATE = new Date('2026-03-09T00:00:00');

// basket 데이터 업데이트 시 basketOpenDate를 변경해주어야합니다.
export const BASKET_OPEN_DATE = new Date('2026-01-31T00:00:00');

// API 연결 확장성을 위해 fetchCurrentPeriod, fetchPreSeatOpenDate, fetchBasketOpenDate 함수를 만들어두었습니다.
export const fetchCurrentPeriod = async (): Promise<AcademicSchedule> => {
  return CURRENT_PERIOD;
};

export const fetchPreSeatOpenDate = async (): Promise<Date> => {
  return PRESEAT_OPEN_DATE;
};

export const fetchBasketOpenDate = async (): Promise<Date> => {
  return BASKET_OPEN_DATE;
};
