import type { ComponentPropsWithoutRef } from 'react';
type ButtonVariant = 'contain' | 'plain';

interface IIconButton extends ComponentPropsWithoutRef<'button'> {
  icon: React.ReactNode;
  label: string;
  variant?: ButtonVariant;
}

function IconButton({ icon, variant = 'plain', label, ...rest }: IIconButton) {
  const variantClass = getVariantClass(variant);
  const buttonClass = 'flex flex-row items-center justify-center gap-1 cursor-pointer rounded-md';

  const finalClassName = `${buttonClass} ${variantClass} `.trim();

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
      return 'px-3 py-3 border border-gray-300 hover:bg-gray-100';
    case 'plain':
      return 'bg-transparent text-gray-700';
    default:
      return '';
  }
}
