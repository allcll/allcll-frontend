type BadgeVariants = 'success' | 'warning' | 'danger';

interface IBadge {
  variant: BadgeVariants;
  children: React.ReactNode;
}

function Badge({ variant, children }: IBadge) {
  const variantClass = getVariantClass(variant);

  return <div className={`${variantClass} px-2 py-1 text-xs rounded-full inline-flex`}>{children}</div>;
}

export default Badge;

function getVariantClass(variant: BadgeVariants) {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-600 font-semibold';
    case 'warning':
      return 'bg-yellow-100 text-yellow-600 font-semibold';
    case 'danger':
      return 'bg-secondary-100 text-secondary-600 font-semibold';
    default:
      return '';
  }
}
