import React from 'react';
type BadgeVariants = 'success' | 'warning' | 'danger' | 'default';

interface IBadge {
  variant: BadgeVariants;
  children: React.ReactNode;
}

function Badge({ variant, children }: IBadge) {
  const variantClass = getVariantClass(variant);

  return <span className={`${variantClass} px-3 py-1 rounded-full text-xs font-bold`}>{children}</span>;
}

export default Badge;

function getVariantClass(variant: BadgeVariants) {
  switch (variant) {
    case 'success':
      return 'bg-green-100 text-green-500 ';
    case 'warning':
      return 'bg-yellow-100 text-yellow-500 ';
    case 'danger':
      return 'bg-secondary-100 text-secondary-500 ';
    case 'default':
      return 'bg-gray-300 text-black ';
    default:
      return '';
  }
}
