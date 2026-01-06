import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'text' | 'contain' | 'outlined' | 'ghost' | 'circle';

type ButtonSize = 'small' | 'medium' | 'large';
type TextColor = 'primary' | 'secondary' | 'gray';

interface IButton extends ComponentPropsWithoutRef<'button'> {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  textColor?: TextColor;
  asChild?: boolean;
}

function Button({ variant, size, children, disabled, textColor, asChild, ...rest }: IButton) {
  const Comp = asChild ? Slot : 'button';
  const buttonClass =
    variant === 'circle'
      ? ''
      : 'flex flex-row gap-1 items-center justify-center cursor-pointer disabled:cursor-not-allowed';

  const variantClass = textColor ? getVariantClass(variant, textColor) : getVariantClass(variant, 'primary');
  const sizeClass = variant === 'circle' ? '' : getSizeClass(size);
  const finalClassName = `${buttonClass} ${variantClass} ${sizeClass}`.trim();

  return (
    <Comp className={finalClassName} disabled={disabled} {...rest}>
      {children}
    </Comp>
  );
}

export default Button;

function getTextVariant(textColor: TextColor) {
  switch (textColor) {
    case 'primary':
      return 'bg-transparent text-primary-500 hover:text-primary-600';
    case 'secondary':
      return 'bg-transparent text-secondary-500 hover:text-secondary-600';
    case 'gray':
      return 'bg-transparent text-gray-700 hover:text-gray-800';
    default:
      return '';
  }
}

function getVariantClass(variant: ButtonVariant, textColor: TextColor) {
  switch (variant) {
    case 'primary':
      return 'bg-primary-500 text-white hover:bg-primary-600 rounded-md';
    case 'secondary':
      return 'bg-gray-100  hover:bg-gray-300 rounded-md';
    case 'outlined':
      return 'bg-transparent border border-gray-700 hover:bg-gray-100 rounded-md';
    case 'danger':
      return 'bg-secondary-500 text-white hover:bg-secondary-600 rounded-md';
    case 'ghost':
      return 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-200 rounded-full';
    case 'circle':
      return 'px-2 py-2 bg-primary-500 text-white hover:bg-primary-600 rounded-full shadow-md ';
    case 'text':
      return `${getTextVariant(textColor)} px-0 py-0`;
    default:
      return '';
  }
}

function getSizeClass(size: string) {
  switch (size) {
    case 'small':
      return 'text-sm px-4 py-2';
    case 'medium':
      return 'text-sm px-4 py-2';
    case 'large':
      return 'text-md px-5 py-2';
    default:
      return '';
  }
}
