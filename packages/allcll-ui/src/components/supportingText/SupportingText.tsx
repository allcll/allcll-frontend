import type { ComponentPropsWithoutRef } from 'react';

export interface SubtitleProps extends ComponentPropsWithoutRef<'p'> {}

function SupportingText({ className, children, ...props }: SubtitleProps) {
  return (
    <p className={`text-gray-500 text-sm leading-relaxed ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
}

export default SupportingText;
