import { APPLY_STATUS } from './simulation.ts';

/** 수강신청 연습 결과 상태별 색상 */
export function getStausColor(status: APPLY_STATUS) {
  return getTextBgColor(getStatusColorCode(status));
}

export function getStatusColorCode(status: APPLY_STATUS) {
  switch (status) {
    case APPLY_STATUS.SUCCESS:
      return 'green';
    case APPLY_STATUS.FAILED:
      return 'red';
    case APPLY_STATUS.CAPTCHA_FAILED:
      return 'orange';
    case APPLY_STATUS.PROGRESS:
      return 'yellow';
    default:
      return 'gray';
  }
}

function getTextBgColor(color: string) {
  switch (color) {
    case 'green':
      return 'bg-green-100 text-green-500';
    case 'red':
      return 'bg-red-100 text-red-500';
    case 'orange':
      return 'bg-orange-100 text-orange-500';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-500';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}
