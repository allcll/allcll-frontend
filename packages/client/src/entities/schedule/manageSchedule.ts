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

export interface AcademicSchedule {
  // 서비스 전환 기준 날짜들입니다.
  periods: ServicePeriod[];

  // 배너에 표시할 주요 수강신청 기간입니다.
  displayPeriod: {
    start: string; // '02월 10일(화)'
    end: string; // '02월 13일(금)'
  };
}

//TODO: 이것도 API 연결로 바꾸는게 좋을지, semster과 합치는 것도 고려
//CURRENT_PERIOD의 start, end 필드는 매 학기  일정이 나오면 업데이트 되어야합니다.
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
    start: '02월 10일(화)',
    end: '02월 13일(금)',
  },
};

//preSeat오픈 날짜 => 해당 데이터는 수동으로 업데이트 필요
export const PRESEAT_OPEN_DATE = new Date('2026-02-29T00:00:00');
