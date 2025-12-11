import type { ComponentPropsWithoutRef } from 'react';

export interface SubtitleProps extends ComponentPropsWithoutRef<'p'> {}

function SupportingText({ className, children, ...props }: SubtitleProps) {
  return (
    <span className={`text-gray-600 text-sm leading-relaxed ${className ?? ''}`} {...props}>
      {children}
    </span>
  );
}

export default SupportingText;
