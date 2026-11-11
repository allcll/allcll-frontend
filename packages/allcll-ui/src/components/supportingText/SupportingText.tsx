import type { ComponentPropsWithoutRef } from 'react';

export type SupportingTextProps = ComponentPropsWithoutRef<'p'>;

function SupportingText({ className, children, ...props }: SupportingTextProps) {
  return (
    <p className={`text-gray-600 text-sm leading-relaxed ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
}

export default SupportingText;
