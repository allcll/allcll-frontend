type BadgeVariants = 'success' | 'warning' | 'danger' | 'default' | 'primary' | 'beta';
type BadgeAppearance = 'filled' | 'outline';
type BadgeSize = 'default' | 'small';

interface IBadge {
  variant: BadgeVariants;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  children: React.ReactNode;
}

function Badge({ variant, appearance = 'filled', size = 'default', children }: IBadge) {
  const variantClass = appearance === 'outline' ? getOutlineClass(variant) : getFilledClass(variant);
  const sizeClass = size === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';

  return <div className={`${variantClass} ${sizeClass} font-medium rounded-full inline-flex`}>{children}</div>;
}

export default Badge;

function getFilledClass(variant: BadgeVariants) {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-700';
    case 'warning':
      return 'bg-yellow-100 text-yellow-700';
    case 'danger':
      return 'bg-secondary-100 text-secondary-700';
    case 'primary':
      return 'bg-primary-100 text-primary-700';
    case 'default':
      return 'bg-gray-100 text-gray-700';
    case 'beta':
      return 'bg-rose-100 text-rose-600';
    default:
      return '';
  }
}

function getOutlineClass(variant: BadgeVariants) {
  switch (variant) {
    case 'success':
      return 'border border-green-400 text-green-600';
    case 'warning':
      return 'border border-yellow-400 text-yellow-600';
    case 'danger':
      return 'border border-secondary-400 text-secondary-600';
    case 'primary':
      return 'border border-primary-300 text-primary-400';
    case 'default':
      return 'border border-gray-300 text-gray-500';
    case 'beta':
      return 'border border-rose-300 text-rose-400';
    default:
      return '';
  }
}
