import type { ComponentPropsWithRef } from 'react';

interface ModelButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'cancel' | 'danger';
  disabled?: boolean;
}

function ModelButton({ variant = 'primary', className = '', children, ...rest }: ModelButtonProps) {
  const buttonClass = 'px-4 h-6 text-xs flex items-center gap-1 rounded-xs';
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
      return 'bg-primary-500 text-white hover:bg-primary-600';
    case 'secondary':
      return 'bg-gray-500 text-white hover:bg-gray-600';
    case 'cancel':
      return 'bg-white border border-gray-700 hover:bg-primary-50 hover:border-primary-500';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return '';
  }
}

export default ModelButton;
