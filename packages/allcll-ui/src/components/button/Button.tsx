import type { ComponentPropsWithoutRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { INTERACTION } from '../../config';

export type ButtonVariant = 'solid' | 'outlined' | 'text' | 'ghost' | 'circle';
export type ButtonColor = 'primary' | 'gray' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface IButton extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  variant: ButtonVariant;
  color?: ButtonColor;
  size: ButtonSize;
  disabled?: boolean;
  asChild?: boolean;
}

function Button({ variant, color = 'primary', size, children, disabled, asChild, className = '', ...rest }: IButton) {
  const Comp = asChild ? Slot : 'button';
  const buttonClass =
    variant === 'circle'
      ? ''
      : `flex flex-row gap-1 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40 ${INTERACTION.hoverable} ${INTERACTION.pressable}`;

  const variantClass = getVariantClass(variant, color);
  const sizeClass = variant === 'circle' ? '' : getSizeClass(size, variant === 'text');
  const finalClassName = `${buttonClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <Comp {...rest} className={finalClassName} disabled={disabled}>
      {children}
    </Comp>
  );
}

export default Button;

const SOLID_CLASS: Record<ButtonColor, string> = {
  primary: 'bg-primary-500 text-white not-disabled:hover:bg-primary-600',
  gray: 'bg-gray-100 not-disabled:hover:bg-gray-300',
  danger: 'bg-danger-500 text-white not-disabled:hover:bg-danger-600',
};

const OUTLINED_CLASS: Record<ButtonColor, string> = {
  primary: 'bg-transparent border-primary-500 text-primary-500 not-disabled:hover:bg-primary-50',
  gray: 'bg-white border-gray-300 text-gray-800 not-disabled:hover:bg-gray-50',
  danger: 'bg-transparent border-danger-500 text-danger-500 not-disabled:hover:bg-danger-50',
};

const TEXT_CLASS: Record<ButtonColor, string> = {
  primary: 'text-primary-500 not-disabled:hover:text-primary-700',
  gray: 'text-gray-800 not-disabled:hover:text-primary-500',
  danger: 'text-danger-500 not-disabled:hover:text-danger-700',
};

function getVariantClass(variant: ButtonVariant, color: ButtonColor) {
  switch (variant) {
    case 'solid':
      return `rounded-md ${SOLID_CLASS[color]}`;
    case 'outlined':
      return `border rounded-md ${OUTLINED_CLASS[color]}`;
    case 'text':
      return `bg-transparent ${TEXT_CLASS[color]}`;
    case 'ghost':
      return 'bg-gray-50 border border-gray-200 text-gray-700 not-disabled:hover:bg-gray-200 rounded-full';
    case 'circle':
      return 'px-2 py-2 bg-primary-500 text-white not-disabled:hover:bg-primary-600 rounded-full shadow-md';
  }
}

function getSizeClass(size: ButtonSize, isText: boolean) {
  switch (size) {
    case 'small':
      return isText ? 'py-1.5 text-sm [&_svg]:size-3' : 'px-3 py-1.5 text-sm [&_svg]:size-3';
    case 'large':
      return isText ? 'py-2.5 text-base [&_svg]:size-4' : 'px-5 py-2.5 text-base [&_svg]:size-4';
    case 'medium':
    default:
      return isText ? 'py-2 text-sm [&_svg]:size-3.5' : 'px-4 py-2 text-sm [&_svg]:size-3.5';
  }
}
