import type { HTMLAttributes } from 'react';

interface Button extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cancel' | 'danger';
  disabled?: boolean;
}

function Button({ variant = 'primary', className = '', children, ...rest }: Button) {
  const buttonClass = 'px-3 py-2 flex flex-row gap-1 cursor-pointer rounded';
  const variantClass = getVariantClass(variant);
  const finalClassName = `${buttonClass} ${variantClass} ${className}`.trim();

  return (
    <button className={finalClassName} {...rest}>
      {children}
    </button>
  );
}

function getVariantClass(variant: string) {
  switch (variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'secondary':
      return 'bg-gray-500 text-white hover:bg-gray-600';
    case 'cancel':
      return 'bg-white border border-gray-700 hover:bg-gray-100';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return '';
  }
}

export default Button;
