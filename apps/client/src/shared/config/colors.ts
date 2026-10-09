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

export function getSelectedColor(selected: boolean) {
  return selected
    ? 'bg-blue-100 text-blue-500 focus:outline-blue-500'
    : 'bg-gray-100 text-gray-700 focus:outline-gray-400';
}

export function getSeatVariant(seats: number | undefined | null) {
  if (seats === undefined || seats === null) return 'default';

  if (seats > 5) return 'success';
  if (seats > 0) return 'warning';
  if (seats == 0) return 'danger';

  return 'default';
}

export function getWishesVariant(wishCount: number | undefined | null) {
  if (wishCount === undefined || wishCount === null) return 'default';

  if (wishCount >= 100) return 'danger';
  if (wishCount >= 50) return 'warning';
  if (wishCount >= 0) return 'success';

  return 'default';
}
