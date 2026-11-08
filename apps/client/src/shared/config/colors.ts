export function getSeatColor(seats: number) {
  if (seats > 5) return 'text-green-500 bg-green-100';
  if (seats > 0) return 'text-yellow-500 bg-yellow-100';
  if (seats == 0) return 'text-danger-500 bg-danger-100';

  return 'text-gray-500 bg-gray-100';
}

export function getSelectedColor(selected: boolean) {
  return selected
    ? 'bg-primary-100 text-primary-500 focus:outline-primary-500'
    : 'bg-gray-100 text-gray-700 focus:outline-gray-400';
}

export function getSeatBadgeColor(seats: number | undefined | null) {
  if (seats === undefined || seats === null) return 'gray';

  if (seats > 5) return 'success';
  if (seats > 0) return 'warning';
  if (seats == 0) return 'danger';

  return 'gray';
}

export function getWishesBadgeColor(wishCount: number | undefined | null) {
  if (wishCount === undefined || wishCount === null) return 'gray';

  if (wishCount >= 100) return 'danger';
  if (wishCount >= 50) return 'warning';
  if (wishCount >= 0) return 'success';

  return 'gray';
}
