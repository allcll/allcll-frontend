import type { ComponentPropsWithoutRef, ElementType } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

interface HeadingProps extends ComponentPropsWithoutRef<'h1'> {
  level: HeadingLevel;
  size?: HeadingSize;
  as?: ElementType;
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
    6: 'xs',
  }[level] as HeadingSize;
}

function getSizeClass(size: HeadingSize) {
  return {
    xxl: 'text-3xl font-semibold',
    xl: 'text-2xl font-semibold',
    lg: 'text-xl font-semibold',
    md: 'text-lg font-semibold',
    sm: 'text-base font-medium',
    xs: 'text-sm font-medium',
  }[size];
}
