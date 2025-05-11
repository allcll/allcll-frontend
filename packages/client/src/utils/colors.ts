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
  switch (status) {
    case APPLY_STATUS.SUCCESS:
      return 'text-green-500 bg-green-100';
    case APPLY_STATUS.FAILED:
      return 'text-red-500 bg-red-100';
    case APPLY_STATUS.DOUBLED:
      return 'text-yellow-500 bg-yellow-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}
