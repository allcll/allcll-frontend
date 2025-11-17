import type { HTMLAttributes } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cancel' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  const baseClass = 'flex flex-row gap-1 cursor-pointer rounded';
  const variantClass = getVariantClass(variant);
  const sizeClass = getSizeClass(size);
  const finalClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

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

function getSizeClass(size: string) {
  switch (size) {
    case 'sm':
      return 'px-2 py-1 text-xs';
    case 'md':
      return 'px-3 py-2 text-sm';
    case 'lg':
      return 'px-4 py-3 text-base';
    default:
      return '';
  }
}

export default Button;
