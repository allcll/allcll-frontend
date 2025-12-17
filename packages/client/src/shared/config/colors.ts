import { APPLY_STATUS } from '@/utils/simulation/simulation.ts';

export function getSeatColor(seats: number) {
  if (seats > 5) return 'text-green-500 bg-green-100';
  if (seats > 0) return 'text-yellow-500 bg-yellow-100';
  if (seats == 0) return 'text-red-500 bg-red-100';

  return 'text-gray-500 bg-gray-100';
}

export function getWishesColor(wishCount: number) {
  if (wishCount >= 100) return 'text-red-500 bg-red-100';
  if (wishCount >= 50) return 'text-yellow-500 bg-yellow-100';
  if (wishCount >= 0) return 'text-green-500 bg-green-100';

  return 'text-gray-500 bg-gray-100';
}

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

export function getSelectedColor(selected: boolean) {
  return selected
    ? 'bg-blue-100 text-blue-500 focus:outline-blue-500'
    : 'bg-gray-100 text-gray-700 focus:outline-gray-400';
}
