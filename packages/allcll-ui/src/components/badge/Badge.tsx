type BadgeColor = 'success' | 'warning' | 'danger' | 'primary' | 'gray';
type BadgeVariant = 'filled' | 'outlined';
type BadgeSize = 'small' | 'medium';

interface IBadge {
  color: BadgeColor;
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

function Badge({ color, variant = 'filled', size = 'medium', children }: IBadge) {
  const variantClass = variant === 'outlined' ? getOutlinedClass(color) : getFilledClass(color);
  const sizeClass = size === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

  return <div className={`${variantClass} ${sizeClass} font-medium rounded-full inline-flex`}>{children}</div>;
}

export default Badge;

function getFilledClass(color: BadgeColor) {
  switch (color) {
    case 'success':
      return 'bg-success-muted text-green-700 dark:text-green-400';
    case 'warning':
      return 'bg-warning-muted text-yellow-700 dark:text-yellow-400';
    case 'danger':
      return 'bg-danger-muted text-danger-700 dark:text-danger-400';
    case 'primary':
      return 'bg-primary-muted text-primary-700 dark:text-primary-400';
    case 'gray':
      return 'bg-surface-muted text-fg-secondary';
    default:
      return '';
  }
}

function getOutlinedClass(color: BadgeColor) {
  switch (color) {
    case 'success':
      return 'border border-green-600 text-green-600 dark:text-green-400';
    case 'warning':
      return 'border border-yellow-600 text-yellow-600 dark:text-yellow-400';
    case 'danger':
      return 'border border-danger-600 text-danger-600 dark:text-danger-400';
    case 'primary':
      return 'border border-primary-600 text-primary-600 dark:text-primary-400';
    case 'gray':
      return 'border border-fg-muted text-fg-muted';
    default:
      return '';
  }
}
