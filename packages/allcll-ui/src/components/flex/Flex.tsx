import type { ComponentPropsWithRef, ElementType } from 'react';

const DIRECTION_CLASS = {
  row: 'flex-row',
  column: 'flex-col',
};

const JUSTIFY_CLASS = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

const ALIGN_CLASS = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const GAP_CLASS = {
  0: 'gap-0',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

type FlexProps = ComponentPropsWithRef<'div'> & {
  as?: ElementType;
  direction?: keyof typeof DIRECTION_CLASS;
  wrap?: boolean;
  justify?: keyof typeof JUSTIFY_CLASS;
  align?: keyof typeof ALIGN_CLASS;
  gap?: keyof typeof GAP_CLASS;
};

function Flex({
  as,
  direction = 'row',
  wrap = false,
  justify = 'start',
  align = 'stretch',
  gap = 2,
  className,
  children,
  ...rest
}: FlexProps) {
  const Tag = as || 'div';

  const finalClass =
    `flex ${DIRECTION_CLASS[direction]} ${wrap ? 'flex-wrap' : ''} ${JUSTIFY_CLASS[justify]} ${ALIGN_CLASS[align]} ${GAP_CLASS[gap]}` +
    (className ? ` ${className}` : '');

  return (
    <Tag className={finalClass} {...rest}>
      {children}
    </Tag>
  );
}

export default Flex;
