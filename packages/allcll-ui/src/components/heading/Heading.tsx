import type { ComponentPropsWithoutRef } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5;

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level: HeadingLevel;
  className?: string;
}

function Heading({ level = 1, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag className={`${className ?? ''} ${LEVEL_CLASS[level]} text-text-200`} {...props}>
      {children}
    </Tag>
  );
}

export default Heading;

const LEVEL_CLASS: Record<HeadingLevel, string> = {
  1: 'text-lg font-semibold md:text-xl',
  2: 'text-base md:text-lg font-semibold',
  3: 'text-base font-semibold',
  4: 'text-sm font-semibold',
  5: 'text-xs font-semibold',
};
