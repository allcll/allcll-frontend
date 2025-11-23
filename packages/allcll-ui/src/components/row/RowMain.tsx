import type { ComponentPropsWithoutRef, ElementType } from 'react';

export interface IRow extends ComponentPropsWithoutRef<'div'> {
  tag?: ElementType;
  withPadding?: boolean;
  className?: string;
}

export function RowMain({ children, withPadding, className, tag = 'div', ...rest }: IRow) {
  const Tag = tag;

  return (
    <Tag className={`flex items-center w-full ${withPadding ? 'px-4 py-3' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export default RowMain;
