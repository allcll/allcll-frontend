export function getSeatColor(seats: number) {
  if (seats > 5) return 'text-green-500 bg-success-muted';
  if (seats > 0) return 'text-yellow-500 bg-warning-muted';
  if (seats == 0) return 'text-danger-500 bg-danger-muted';

  return 'text-fg-muted bg-surface-muted';
}

export function getSelectedColor(selected: boolean) {
  return selected
    ? 'bg-primary-muted text-primary-500 focus:outline-primary-500'
    : 'bg-surface-muted text-fg-secondary focus:outline-fg-subtle';
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
