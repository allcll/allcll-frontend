import type { ComponentPropsWithoutRef, ElementType, ReactElement } from 'react';
import RowLeft from './RowLeft';
import RowCenter from './RowCenter';
import RowRight from './RowRight';

interface RowMainProps extends ComponentPropsWithoutRef<'div'> {
  tag?: ElementType;
  withPadding?: boolean;
  left: ReactElement<typeof RowLeft> | null;
  center: ReactElement<typeof RowCenter> | null;
  right: ReactElement<typeof RowRight> | null;
}

function RowMain({ tag = 'div', withPadding, left, center, right, className, ...rest }: RowMainProps) {
  const Tag = tag;

  return (
    <Tag className={`flex items-center w-full ${withPadding ? 'px-4 py-3' : ''} ${className ?? ''}`} {...rest}>
      {left}
      {center}
      {right}
    </Tag>
  );
}

export default RowMain;
