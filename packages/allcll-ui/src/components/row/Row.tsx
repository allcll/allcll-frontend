import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

interface IRow extends ComponentPropsWithoutRef<'div'> {
  tag?: ElementType;
  contents?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  withPadding?: boolean;
  className?: string;
}

function Row({ tag = 'div', left, right, contents, withPadding, className, ...rest }: Readonly<IRow>) {
  const Tag = tag;

  return (
    <Tag className={`flex items-center w-full ${withPadding ? 'px-4 py-3' : ''} ${className}`} {...rest}>
      {left && <div className="mr-3 flex-shrink-0 flex items-center justify-center">{left}</div>}

      <div className="flex-1">{contents}</div>

      {right && <div className="ml-3 flex-shrink-0 flex items-center justify-center">{right}</div>}
    </Tag>
  );
}

export default Row;
