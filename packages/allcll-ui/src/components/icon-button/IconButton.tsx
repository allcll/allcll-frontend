import type { ComponentPropsWithoutRef } from 'react';
type ButtonVariant = 'contain' | 'plain';

interface IIconButton extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
}

function IconButton({ icon, variant = 'plain', label, className = '', ...rest }: IIconButton) {
  const variantClass = getVariantClass(variant);
  const buttonClass = 'flex flex-row items-center justify-center gap-1 ';

  const finalClassName = `${buttonClass} ${variantClass} ${className}`;

  return (
    <button type="button" aria-label={label} className={finalClassName} {...rest}>
      {icon && <span>{icon}</span>}
    </button>
  );
}

export default IconButton;

function getVariantClass(variant: string) {
  switch (variant) {
    case 'contain':
      return 'p-2.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors duration-300 ease-out';
    case 'plain':
      return 'rounded-md bg-transparent text-gray-700';
    default:
      return '';
  }
}
