import type { HTMLAttributes } from 'react';

interface ModelButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cancel' | 'danger';
  disabled?: boolean;
}

function ModelButton({ variant = 'primary', className = '', children, ...rest }: ModelButtonProps) {
  const buttonClass = 'px-4 h-6 text-xs flex items-center gap-1 rounded-xs cursor-pointer';
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
      return 'bg-white border border-gray-700 hover:bg-blue-50 hover:border-blue-500';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return '';
  }
}

export default ModelButton;
