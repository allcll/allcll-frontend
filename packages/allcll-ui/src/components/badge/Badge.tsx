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
      return 'bg-green-100 text-green-700';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700';
    case 'danger':
      return 'bg-danger-100 text-danger-700';
    case 'primary':
      return 'bg-primary-100 text-primary-700';
    case 'gray':
      return 'bg-gray-100 text-gray-700';
    default:
      return '';
  }
}

function getOutlinedClass(color: BadgeColor) {
  switch (color) {
    case 'success':
      return 'border border-green-600 text-green-600';
    case 'warning':
      return 'border border-yellow-600 text-yellow-600';
    case 'danger':
      return 'border border-danger-600 text-danger-600';
    case 'primary':
      return 'border border-primary-600 text-primary-600';
    case 'gray':
      return 'border border-gray-600 text-gray-600';
    default:
      return '';
  }
}
