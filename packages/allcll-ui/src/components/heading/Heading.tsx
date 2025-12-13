import type { ComponentPropsWithoutRef, ElementType } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5;
type HeadingSize = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level: HeadingLevel;
  size?: HeadingSize;
  as?: ElementType;
  className?: string;
}

function Heading({ level = 1, size, as, className, children, ...props }: HeadingProps) {
  const Tag = (as ?? `h${level}`) as ElementType;
  const appliedSize = size ?? levelToSize(level);

  return (
    <Tag className={`${getSizeClass(appliedSize)} ${className || ''}`} {...props}>
      {children}
    </Tag>
  );
}

export default Heading;

function levelToSize(level: HeadingLevel): HeadingSize {
  return {
    1: 'xxl',
    2: 'xl',
    3: 'lg',
    4: 'md',
    5: 'sm',
  }[level] as HeadingSize;
}

function getSizeClass(size: HeadingSize) {
  return {
    xxl: 'text-xl font-semibold',
    xl: 'text-lg font-semibold',
    lg: 'text-base font-semibold',
    md: 'text-sm font-semibold',
    sm: 'text-xs font-semibold',
    xs: 'text-[11px] font-semibold',
  }[size];
}
