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
      return 'bg-success-muted text-green-500';
    case 'red':
      return 'bg-danger-muted text-danger-500';
    case 'orange':
      return 'bg-orange-100 dark:bg-orange-500/25 text-orange-500';
    case 'yellow':
      return 'bg-warning-muted text-yellow-500';
    default:
      return 'bg-surface-muted text-fg-muted';
  }
}
