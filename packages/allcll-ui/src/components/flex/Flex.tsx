import type { ComponentPropsWithRef, ElementType } from 'react';

type FlexProps = ComponentPropsWithRef<'div'> & {
  as?: ElementType;

  direction?: 'flex-row' | 'flex-col';
  justify?: 'justify-start' | 'justify-center' | 'justify-end' | 'justify-between';
  align?: 'items-start' | 'items-center' | 'items-end' | 'items-stretch';

  gap?: `gap-${number}`;
};

function Flex({
  as,
  direction = 'flex-row',
  justify = 'justify-start',
  align = 'items-stretch',
  gap = 'gap-3',
  className,
  children,
  ...rest
}: FlexProps) {
  const Tag = as || 'div';

  const finalClass = `flex ${direction} ${justify} ${align} ${gap}` + (className ? ` ${className}` : '');

  return (
    <Tag className={finalClass} {...rest}>
      {children}
    </Tag>
  );
}

export default Flex;
