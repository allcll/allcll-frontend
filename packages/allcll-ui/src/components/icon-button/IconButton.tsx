import type { ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'contain' | 'plain';
export type IconButtonSize = 'small' | 'medium' | 'large';

interface IIconButton extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
  size: IconButtonSize;
}

const SIZE_CLASS: Record<IconButtonSize, string> = {
  small: '[&_svg]:size-3',
  medium: '[&_svg]:size-4',
  large: '[&_svg]:size-5',
};

function IconButton({ icon, variant = 'plain', size, label, className = '', ...rest }: IIconButton) {
  const finalClassName = `flex flex-row items-center justify-center gap-1 ${getVariantClass(variant)} ${SIZE_CLASS[size]} ${className}`;

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
