import { ServiceMode, ServicePeriod } from './manageSchedule';

interface MainAction {
  label: string;
  link: string;
}

/**
 * 메인 페이지에서 보여지는 액션 버튼의 모드를 반환하는 함수입니다.
 * 각 수강 신청 기간에 따라 다른 액션 버튼이 메인 페이지에 표시됩니다.
 * @param mode
 * @returns
 */
export const getMainPageActionsMode = (mode: ServicePeriod['mode']): MainAction[] => {
  switch (mode) {
    case ServiceMode.WISHLIST:
      return [
        { label: '관심과목 담기', link: '/wishlist' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];

    case ServiceMode.REGISTRATION_SENIOR:
    case ServiceMode.REGISTRATION_ALL:
    case ServiceMode.REGISTRATION_FRESHMAN:
    case ServiceMode.CORRECTION:
      return [
        { label: '실시간 여석 확인하기', link: '/live' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];

    default:
      return [
        { label: '전체 학년 여석 확인하기', link: '/live' },
        { label: '수강 신청 연습하기', link: '/simulation' },
      ];
  }
};
